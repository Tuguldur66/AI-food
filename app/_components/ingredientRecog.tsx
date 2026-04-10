"use client";

import { useState } from "react";
import { RotateCw, Sparkles, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const IngredientRecog = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const recognizeIngredients = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const rawText = await res.text();
      console.log("Raw response:", rawText);
      console.log("Status:", res.status);

      if (!res.ok) {
        console.error("API failed with status:", res.status, rawText);
        setResponse("Something went wrong. Please try again.");
        return;
      }

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.error("Failed to parse JSON:", parseErr, rawText);
        setResponse("Something went wrong. Please try again.");
        return;
      }

      setResponse(data.result || "No result returned.");
    } catch (err) {
      console.error("Fetch error:", err);
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
