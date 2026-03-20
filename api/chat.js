/**
 * Vercel serverless function: POST /api/chat
 * Receives messages + product context, returns Claude response for Q&A.
 *
 * Required env var: ANTHROPIC_API_KEY
 */

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey });

    const systemPrompt = `You are a knowledgeable structured products specialist embedded in a financial analysis tool called structured.ai. You help financial advisors and their clients understand structured notes — autocallables, reverse convertibles, barrier notes, buffered notes, return enhanced notes, and more.

Your role:
- Answer questions clearly and concisely
- Explain complex concepts in simple terms when talking to clients
- Provide detailed technical analysis when talking to advisors
- Reference the specific product being viewed when relevant
- Use concrete numbers and examples

Current context:
${context || 'No specific product loaded.'}

Guidelines:
- Keep answers focused and practical — 2-4 sentences for simple questions, more for complex ones
- Use bullet points for lists
- When discussing payoffs, reference specific levels (e.g., "if META drops to 70% of initial...")
- Never give investment advice or recommendations — only explain how the product works
- If asked about something outside structured products, politely redirect`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text = response.content[0].text;
    return res.status(200).json({ response: text });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: err.message || 'Chat failed' });
  }
}
