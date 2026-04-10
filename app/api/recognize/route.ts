import { InferenceClient } from "@huggingface/inference";
import { NextResponse } from "next/server";

const token = process.env.HUGGINFACE_API_KEY;
const client = new InferenceClient(token);

export async function POST(request: Request) {
  const body = await request.json();

  const { base64 } = body;

  try {
    const chatCompletion = await client.chatCompletion({
      model: "moonshotai/Kimi-K2.5:novita",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "i will upload a photo and you will detect all the ingredients.",
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64}` },
            },
          ],
        },
      ],
    });
    return NextResponse.json(
      {
        result: chatCompletion.choices[0].message.content ?? "",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        result: "",
      },
      { status: 500 },
    );
  }
}
