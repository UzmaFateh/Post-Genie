// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();

//     // 🔐 API Key sirf server me use karo
//     const apiKey = process.env.GEMINI_API_KEY;

//     // 📡 Gemini API call
//     const response = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//         }),
//       }
//     );

//     const data = await response.json();
//     const generatedText =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No text generated.";

//     return NextResponse.json({ post: generatedText });
//   } catch (error) {
//     console.error("LLM Error:", error);
//     return NextResponse.json({ error: "Failed to generate post" }, { status: 500 });
//   }
// }
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// import { NextResponse } from "next/server";

// export async function POST(req: Request) {

//     console.log("🔑 GEMINI KEY:", process.env.GEMINI_API_KEY);
//   try {
//     const { topic, tone, language } = await req.json();

//     if (!topic || !tone || !language) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     console.log("🔑 GEMINI KEY:", process.env.GEMINI_API_KEY);


//     // ✅ Gemini API call
//     const prompt = `Write a ${tone} LinkedIn post about "${topic}" in ${language}. Keep it engaging and platform-appropriate.`;

   

//     const resp = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//         }),
//       }
//     );



//     const data = await resp.json();

//     // ✅ Safely extract response
//     const text =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "⚠️ No text generated.";

//     return NextResponse.json({ post: text });
//   } catch (error: any) {
//     console.error("Gemini API Error:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
/////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// src/app/api/generate_post/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic, tone, language } = await req.json();

    if (!topic || !tone || !language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `Write a ${tone} LinkedIn post about "${topic}" in ${language}. Keep it engaging and platform-appropriate.`;

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!resp.ok) {
      const errorData = await resp.json();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: `API request failed: ${resp.status} ${errorData?.error?.message || 'Unknown error'}` },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    console.log("📩 Gemini Response:", data);

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "⚠️ No text generated.";

    return NextResponse.json({ post: text });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

