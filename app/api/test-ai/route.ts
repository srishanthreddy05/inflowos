// /app/api/test-ai/route.js

import OpenAI from "openai";

export async function GET() {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const res = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "user", content: "Say hello" },
    ],
  });

  return Response.json(res.choices[0].message.content);
}