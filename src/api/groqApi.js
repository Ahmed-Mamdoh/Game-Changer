export async function chatWithGroq({ messages, model }) {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages,
    }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.choices[0].message;
  } catch (error) {
    console.error(error);
    return "error";
  }
}
