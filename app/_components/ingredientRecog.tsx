"use client";

import { useState } from "react";
import Groq from "groq-sdk";
import { RotateCw, Sparkles, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
  dangerouslyAllowBrowser: true,
});

export const IngredientRecog = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const recognizeIngredients = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

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
      setResponse(text);
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setResponse("");
  };

  return (
    <div className="w-145">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Sparkles />
          <h1 className="text-xl font-semibold">Ingredient recognition</h1>
        </div>
        <button
          onClick={handleReset}
          className="border border-gray-100 flex justify-center items-center w-12 h-10 hover:bg-black hover:text-white"
        >
          <RotateCw className="opacity-40" />
        </button>
      </div>
      <p className="text-xs opacity-50">
        Describe the food, and AI will detect the ingredients.
      </p>
      <div className="w-145">
        <Textarea
          className="w-145 h-32.5 border border-gray-100"
          placeholder="Орц тодорхойлох"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            onClick={recognizeIngredients}
            disabled={loading || !prompt.trim()}
            className="w-23.5 h-10 flex justify-center items-center text-white bg-gray-200 mt-2 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate
          </button>
        </div>
      </div>
      <div className="mt-6 flex flex-col">
        <div className="flex gap-2">
          <FileText />
          <h1 className="text-xl font-semibold">Identified Ingredients</h1>
        </div>
        {!response && !loading && (
          <p className="text-xs opacity-50 mt-3">
            First, enter your text to recognize ingredients.
          </p>
        )}
        {loading && (
          <p className="text-xs opacity-50 mt-3 animate-pulse">
            Analyzing ingredients...
          </p>
        )}
        {response && (
          <div className="mt-3 text-sm whitespace-pre-wrap border border-gray-100 rounded p-3">
            {response}
          </div>
        )}
      </div>
    </div>
  );
};
