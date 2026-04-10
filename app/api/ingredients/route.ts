import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a culinary expert. When the user describes a food dish, list all the likely ingredients needed to make it. Format your response as a clear bullet list.",
        },
        {
          role: "user",
          content: `What are the ingredients in: ${prompt}`,
        },
      ],
    });

    const text = result.choices[0].message.content ?? "";
    return NextResponse.json({ result: text }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: "" }, { status: 500 });
  }
}
