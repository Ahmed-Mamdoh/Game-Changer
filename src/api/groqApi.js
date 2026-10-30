import { supabase } from "@/api/supabase";

export async function chatWithGroq({ messages, model, ...settings }) {
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
        // response_format, reasoning_effort, max_completion_tokens
        ...settings,
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

// Streams a chat reply, calling onText with the text so far as it arrives.
// Returns the final message, or the same status strings as chatWithGroq.
// Aborting the signal stops the reply: what arrived comes back marked
// stopped, or "stopped" when nothing did.
// Falls back to a plain JSON reply when the proxy does not stream.
export async function streamChatWithGroq({
  messages,
  model,
  onText,
  signal,
  ...settings
}) {
  let content = "";
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return "unauthenticated";

    const response = await fetch("/api/groqProvider", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ model, messages, stream: true, ...settings }),
      signal,
    });
    if (response.status === 401) return "unauthenticated";
    if (response.status === 429) return "rate_limited";
    if (!response.ok) return "error";

    if (!response.headers.get("content-type")?.includes("text/event-stream")) {
      const result = await response.json();
      return result.choices[0].message;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // Server-sent events are separated by blank lines
      const events = buffer.split("\n\n");
      buffer = events.pop();
      for (const event of events) {
        const data = event.replace(/^data: /, "").trim();
        if (!data || data === "[DONE]") continue;
        const delta = JSON.parse(data).choices?.[0]?.delta?.content;
        if (delta) {
          content += delta;
          onText?.(content);
        }
      }
    }
    return content ? { role: "assistant", content } : "error";
  } catch (error) {
    if (signal?.aborted) {
      return content
        ? { role: "assistant", content, stopped: true }
        : "stopped";
    }
    console.error(error);
    // Keep what arrived if the stream broke partway
    return content ? { role: "assistant", content } : "error";
  }
}
