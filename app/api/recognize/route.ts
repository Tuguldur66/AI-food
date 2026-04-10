const recognizeIngredients = async () => {
  if (!prompt.trim()) return;
  setLoading(true);
  setResponse("");

  try {
    const res = await fetch("/api/recognize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const raw = await res.text(); // read as text first
    console.log("Raw response:", raw); // check browser console

    const data = JSON.parse(raw); // then parse

    if (!res.ok || data.error) {
      setResponse(`Error: ${data.error ?? "Unknown error"}`);
      return;
    }

    setResponse(data.text ?? "No response received.");
  } catch (error) {
    console.error("Error:", error);
    setResponse("Sorry, something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};
