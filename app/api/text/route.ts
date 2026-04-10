import { InferenceClient } from "@huggingface/inference";
import { NextResponse } from "next/server";

const token = process.env.HUGGINFACE_API_KEY;
const client = new InferenceClient(token);

export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    const image = await client.textToImage({
      provider: "nscale",
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: `you are chef and you will make food about ${prompt}`,
      parameters: { num_inference_steps: 5 },
    });
    const buffer = Buffer.from(await (image as unknown as Blob).arrayBuffer());
    const base64 = buffer.toString("base64");
    return NextResponse.json({ base64 }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ base64: "" }, { status: 500 });
  }
}
