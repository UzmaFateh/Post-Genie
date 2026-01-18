import { NextResponse } from "next/server";

type Req = {
  topic: string;
  n?: number;
};

async function callLLM(prompt: string): Promise<string> {
  // 🔐 API Key sirf server me use karo
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API_KEY environment variable is not set");
    throw new Error("API key is not configured");
  }

  // 📡 Gemini API call
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Gemini API error:", errorData);
    throw new Error(`API request failed: ${response.status} ${errorData?.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  console.log("Gemini API response:", data); // For debugging

  // Extract the text from the response
  const generatedText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
    JSON.stringify(data) ||
    "⚠️ No hashtags generated.";

  return generatedText;
}

export async function POST(req: Request) {
  try {
    const body: Req = await req.json();
    const { topic, n = 10 } = body;

    const prompt = `Generate ${n} trending and relevant LinkedIn hashtags for the topic: '${topic}'. Return comma-separated hashtags.`;

    const hashtags = await callLLM(prompt);
    return NextResponse.json({ hashtags });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
