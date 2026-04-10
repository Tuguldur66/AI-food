"use client";

import { ChangeEventHandler, useState } from "react";
import { InferenceClient } from "@huggingface/inference";
import { RotateCw, Sparkles, FileText, Loader2 } from "lucide-react";

const token = process.env.NEXT_PUBLIC_HUGGINFACE_API_KEY;
const client = new InferenceClient(token);

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const ImageAnalysis = () => {
  const [result, setResult] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSelectedImage(event?.target?.files?.[0] ?? null);
  };

  const generateImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const base64 = await fileToBase64(selectedImage);
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
      setResult(chatCompletion.choices[0].message.content ?? "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-145">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Sparkles />
          <h1 className="text-xl font-semibold">Image analysis</h1>
        </div>
        <button
          className="border border-gray-100 flex justify-center items-center w-12 h-10 hover:bg-black hover:text-white"
          onClick={() => {
            setSelectedImage(null);
          }}
        >
          <RotateCw className="opacity-40" />
        </button>
      </div>
      <p className="text-xs opacity-50">
        Upload a food photo, and AI will detect the ingredients.
      </p>
      <div className="w-145">
        <label className="flex items-center w-full border-2 border-gray-100 rounded-md px-4 py-3 cursor-pointer">
          <span className="font-medium mr-2">Choose File</span>
          <span className="text-gray-400 text-sm">
            {selectedImage ? selectedImage.name : "JPG, PNG"}
          </span>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <div className="flex justify-end">
          <button
            onClick={generateImage}
            disabled={!selectedImage || loading}
            className="w-23.5 h-10 flex justify-center items-center gap-2 text-white bg-gray-200 mt-2 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            generate
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col">
        <div className="flex gap-2">
          <FileText />
          <h1 className="text-xl font-semibold">Here is the summary</h1>
        </div>
        <div>
          {loading ? (
            <div className="flex items-center gap-2 text-sm mt-3 opacity-60">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Working ...</span>
            </div>
          ) : result ? (
            <p className="text-sm mt-3">{result}</p>
          ) : (
            <p className="text-xs opacity-50 mt-3">
              First, enter your image to recognize an ingredients.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
