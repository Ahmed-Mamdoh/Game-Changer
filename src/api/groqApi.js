import { supabase } from "@/api/supabase";

export async function chatWithGroq({ messages, model, response_format }) {
  const url = "/api/groqProvider";

  try {
    // The proxy only serves signed-in users
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return "unauthenticated";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        model: model,
        messages,
        ...(response_format && { response_format }),
      }),
    };

    const response = await fetch(url, options);
    if (response.status === 401) return "unauthenticated";
    if (response.status === 429) return "rate_limited";
    const result = await response.json();
    return result.choices[0].message;
  } catch (error) {
    console.error(error);
    return "error";
  }
}
