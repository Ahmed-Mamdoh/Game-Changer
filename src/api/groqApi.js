export async function chatWithGroq({ messages, model }) {
  const url = "/api/groqProvider";
  const options = {
    method: "POST",
    headers: {
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
