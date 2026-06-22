// backend/services/grokService.js
/**
 * Groq AI Service
 * Wraps the Groq OpenAI-compatible API using the openai SDK.
 *
 * Exports:
 *   askGrok(prompt) -> string reply | null
 *
 * The askGrok name is kept for compatibility with existing controllers.
 */

const OpenAI = require("openai");

const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are an AI-powered menstrual health assistant.

Use the provided context to answer the current user question. The context may include health profile, cycle history, symptoms, mood, pain levels, predictions, risk indicators, and recent chat history.

RESPONSE RULES:
1. Keep every response short: 3-5 sentences maximum and 80 words maximum.
2. Start with a direct answer to the user's question.
3. Include only the most relevant health insight.
4. Use user health data only when relevant to the question.
5. Do not repeat the entire health profile.
6. Do not explain every prediction, profile field, or data source.
7. Do not use emojis.
8. Avoid unnecessary openings such as "Based on your health profile", "I can see that", or "According to your records" unless absolutely necessary for clarity.
9. Do not end every response with a follow-up question.
10. Provide practical advice first when advice is needed.
11. Use a friendly, supportive, and professional tone.
12. Avoid generic filler text.
13. Avoid repeating information already provided in recent messages.
14. Personalization should feel natural and subtle.

SAFETY RULES:
1. Never provide medical diagnoses.
2. If mentioning risks or conditions, use phrases like "may be related to", "could be associated with", or "might indicate".
3. Encourage consulting a healthcare professional for severe, persistent, unusual, or worrying symptoms.
4. Do not give medication dosage advice.

RESPONSE FORMAT:
Start with a direct answer. Include only the most relevant health insight. Give 1-2 actionable recommendations when useful. Keep the response concise.`;

async function askGrok(prompt) {
  if (!process.env.GROQ_API_KEY) {
    console.warn("[grokService] GROQ_API_KEY not set - skipping AI call");
    return null;
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const text = response.choices?.[0]?.message?.content;

    if (!text || text.trim().length === 0) {
      console.warn("[grokService] Received empty response from Groq");
      return null;
    }

    return text.trim();
  } catch (err) {
    console.error("[grokService.askGrok] Error:", err.message || err);
    return null;
  }
}

module.exports = { askGrok };
