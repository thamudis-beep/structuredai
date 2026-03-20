/**
 * Vercel serverless function: POST /api/analyze
 * Receives PDF FormData, extracts text, sends to Claude, returns StructuredProduct JSON.
 *
 * Required env var: ANTHROPIC_API_KEY
 * Dependencies (install in project): pdf-parse, @anthropic-ai/sdk
 */

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    // Parse multipart form data
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);

    // Extract boundary from content-type
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      return res.status(400).json({ error: 'Missing multipart boundary' });
    }

    // Simple multipart parser — extract PDF buffer
    const boundary = boundaryMatch[1];
    const parts = body.toString('binary').split(`--${boundary}`);
    let pdfBuffer = null;
    for (const part of parts) {
      if (part.includes('application/pdf') || part.includes('.pdf')) {
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd !== -1) {
          const binaryData = part.slice(headerEnd + 4).replace(/\r\n$/, '');
          pdfBuffer = Buffer.from(binaryData, 'binary');
        }
      }
    }

    if (!pdfBuffer) {
      return res.status(400).json({ error: 'No PDF file found in request' });
    }

    // Extract text from PDF
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract meaningful text from PDF' });
    }

    // Call Claude API
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey });

    const systemPrompt = `You are a structured products analyst. Given the extracted text of a term sheet PDF, produce a complete JSON analysis. Return ONLY valid JSON matching this schema:

{
  "productType": "autocallable" | "reverse_convertible" | "barrier_note" | "principal_protected" | "range_accrual",
  "issuer": string,
  "notional": number,
  "currency": string,
  "tradeDate": "YYYY-MM-DD",
  "maturityDate": "YYYY-MM-DD",
  "tenor": number (months),
  "underliers": [{ "ticker": string, "name": string, "initialLevel": number, "weight": number }],
  "coupon": { "rate": number (decimal, e.g. 0.092), "frequency": "quarterly"|"monthly"|"semiannual"|"annual"|"atMaturity", "type": "conditional"|"fixed", "barrierLevel": number (decimal), "memory": boolean },
  "autocall": { "enabled": boolean, "startMonth": number, "frequency": "quarterly"|"monthly"|"semiannual", "triggerLevel": number (decimal), "stepdown": number (decimal) } | null,
  "barrier": { "level": number (decimal), "type": "european"|"american" },
  "cap": number | null,
  "summary": string (2-3 sentence FA-facing summary),
  "sellingPoints": string[] (5 bullet points for pitching to clients),
  "riskFactors": string[] (5-6 key risks),
  "talkTrack": string (60-second talk track for the FA to memorize — conversational, no jargon),
  "scenarios": [{ "name": "bull"|"base"|"bear"|"worst", "description": string, "outcome": string }],
  "howItWorks": [{ "step": number, "title": string, "description": string }] (4 steps, client-friendly)
}

Be precise with numbers. Use the exact values from the term sheet. If a field is not applicable, use null. All decimal rates should be as fractions (9.2% = 0.092).`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Analyze this term sheet and return the structured JSON:\n\n${pdfText.slice(0, 12000)}`,
        },
      ],
      system: systemPrompt,
    });

    const responseText = message.content[0].text;

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];

    const product = JSON.parse(jsonStr.trim());

    return res.status(200).json(product);
  } catch (err) {
    console.error('Analyze error:', err);
    return res.status(500).json({ error: err.message || 'Analysis failed' });
  }
}
