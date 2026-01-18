import { NextResponse } from "next/server";

type Req = {
  post_text: string;
  n?: number;
  language?: string;
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
    "⚠️ No comments generated.";

  return generatedText;
}

export async function POST(req: Request) {
  try {
    const body: Req = await req.json();
    const { post_text, n = 3, language = "English" } = body;

    let langInstruction = "Write in English.";
    if (language.toLowerCase() === "urdu") langInstruction = "تبصرے اردو میں لکھو۔";
    if (language.toLowerCase() === "hindi") langInstruction = "टिप्पणियाँ हिंदी में लिखो।";
    if (language.toLowerCase() === "roman urdu") langInstruction = "Roman Urdu mein likho.";

    const prompt = `${langInstruction}\n\nWrite ${n} short (1-2 lines) insightful and conversational comments reacting to this LinkedIn post:\n\n${post_text}`;

    const comments = await callLLM(prompt);
    return NextResponse.json({ comments });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
