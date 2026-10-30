import fetch from "node-fetch";
import { checkOrigin, rateLimit, requireUser } from "./_lib/guard.js";

// Only the chat models the app uses (see src/features/ChatBot/hooks/useChat.jsx
// and src/features/games/hooks/useGetRecommendations.js)
const ALLOWED_MODELS = new Set([
  "openai/gpt-oss-120b",
  "moonshotai/kimi-k2-instruct-0905",
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
]);
const ALLOWED_ROLES = new Set(["system", "user", "assistant"]);
const MAX_MESSAGES = 50;
const MAX_TOTAL_CHARS = 100000;

function validMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  if (messages.length > MAX_MESSAGES) return null;
  let total = 0;
  const cleaned = [];
  for (const m of messages) {
    if (!m || !ALLOWED_ROLES.has(m.role) || typeof m.content !== "string")
      return null;
    total += m.content.length;
    // Drop extra fields (e.g. reasoning) the client echoes back
    cleaned.push({ role: m.role, content: m.content });
  }
  return total <= MAX_TOTAL_CHARS ? cleaned : null;
}

// Structured output (JSON mode or a JSON schema), passed through to Groq
function validResponseFormat(format) {
  if (format === undefined) return { ok: true, value: undefined };
  if (
    !format ||
    typeof format !== "object" ||
    !["json_object", "json_schema"].includes(format.type) ||
    JSON.stringify(format).length > 4000
  )
    return { ok: false };
  return { ok: true, value: format };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!checkOrigin(req, res)) return;
  if (!rateLimit(req, res, { key: "groq-ip", limit: 30, windowMs: 60_000 }))
    return;

  const user = await requireUser(req, res);
  if (!user) return;
  if (
    !rateLimit(req, res, {
      key: "groq-user",
      id: user.id,
      limit: 20,
      windowMs: 60_000,
    })
  )
    return;

  const {
    messages,
    model,
    response_format,
    reasoning_effort,
    max_completion_tokens,
    stream,
  } = req.body || {};
  if (!ALLOWED_MODELS.has(model)) {
    return res.status(400).json({ error: "Model not allowed" });
  }
  const cleanedMessages = validMessages(messages);
  if (!cleanedMessages) {
    return res.status(400).json({ error: "Invalid messages" });
  }
  const format = validResponseFormat(response_format);
  if (!format.ok) {
    return res.status(400).json({ error: "Invalid response format" });
  }
  // Optional limits on how much the model thinks and writes
  const extras = {};
  if (stream === true) extras.stream = true;
  if (["low", "medium", "high"].includes(reasoning_effort))
    extras.reasoning_effort = reasoning_effort;
  if (
    Number.isInteger(max_completion_tokens) &&
    max_completion_tokens > 0 &&
    max_completion_tokens <= 4000
  )
    extras.max_completion_tokens = max_completion_tokens;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: cleanedMessages,
          ...(format.value && { response_format: format.value }),
          ...extras,
        }),
      },
    );

    // Relay the reply as server-sent events as Groq writes it
    if (extras.stream && response.ok) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      });
      for await (const chunk of response.body) res.write(chunk);
      return res.end();
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Groq fetch error:", err);
    // A stream that broke partway can only be closed
    if (res.headersSent) return res.end();
    res.status(500).json({ error: "Failed to fetch Groq data" });
  }
}
