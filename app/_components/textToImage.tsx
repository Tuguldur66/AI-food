"use client";

import { useState } from "react";
import { RotateCw, Sparkles, Image, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const TextToImage = () => {
  const [prompt, setPrompt] = useState("");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImgSrc(null);
    try {
      const response = await fetch("/api/text", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.base64) {
        setImgSrc(`data:image/jpeg;base64,${data.base64}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-145">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Sparkles />
          <h1 className="text-xl font-semibold">Food image creator</h1>
        </div>
        <button
          onClick={() => {
            setPrompt("");
            setImgSrc(null);
          }}
          className="border border-gray-100 flex justify-center items-center w-12 h-10 hover:bg-black hover:text-white"
        >
          <RotateCw className="opacity-40" />
        </button>
      </div>

      <p className="text-xs opacity-50">
        What food image do you want? Describe it briefly
      </p>

      <div className="w-145">
        <Textarea
          className="w-145 h-32.5 border border-gray-100"
          placeholder="Хоолны тайлбар"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
        <div className="flex justify-end">
          <button
            onClick={generateImage}
            disabled={!prompt.trim() || loading}
            className="w-23.5 h-10 flex justify-center items-center text-white bg-gray-200 mt-2 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            generate
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col">
        <div className="flex gap-2">
          <Image />
          <h1 className="text-xl font-semibold">Result</h1>
        </div>
        {loading && (
          <div className="flex items-center gap-3 mt-4 text-sm opacity-60">
            <Loader2 className="animate-spin w-4 h-4" />
            <p>Working on your image, just wait a moment...</p>
          </div>
        )}
        {!loading && !imgSrc && (
          <p className="text-xs opacity-50 mt-3">
            First, enter your text to generate an image.
          </p>
        )}
        {!loading && imgSrc && (
          <div className="mt-3 flex flex-col gap-2">
            <img
              src={imgSrc}
              width={300}
              alt="generated food"
              className="rounded-md"
            />
            <p className="text-sm opacity-60">
              Here's your generated image of{" "}
              <span className="font-medium opacity-100">{prompt}</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
