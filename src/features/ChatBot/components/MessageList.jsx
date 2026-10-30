import { useLayoutEffect } from "react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import { useGamePath } from "../hooks/useGamePath";
import AssistantMark from "./AssistantMark";

const SITE_URL = "https://game-changer-gg.vercel.app";
const linkClass = "text-text-brand underline underline-offset-2";

function InternalLink({ to, onNavigate, children }) {
  const path = useGamePath(to);
  return (
    <Link to={path} onClick={onNavigate} className={linkClass}>
      {children}
    </Link>
  );
}

// Marks where the chat started being about a game
function ContextDivider({ game }) {
  return (
    <div
      role="note"
      className="text-text-muted my-1 flex items-center gap-2.5 text-xs"
    >
      <span className="bg-stroke-subtle h-px flex-1" aria-hidden />
      {game.cover ? (
        <img
          src={game.cover}
          alt=""
          width={16}
          height={21}
          className="h-[21px] w-4 shrink-0 rounded-[2px] object-cover"
        />
      ) : null}
      <span className="max-w-[70%] truncate">
        Now talking about{" "}
        <span className="text-text-main font-medium">{game.name}</span>
      </span>
      <span className="bg-stroke-subtle h-px flex-1" aria-hidden />
    </div>
  );
}

// The bot's face marks the start of each run of assistant messages
function AssistantRow({ showAvatar, children }) {
  return (
    <div className="flex max-w-[92%] items-start gap-2">
      {showAvatar ? (
        <span className="bg-bg-raised border-stroke-subtle mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border">
          <AssistantMark size="sm" />
        </span>
      ) : (
        <span className="w-7 shrink-0" aria-hidden />
      )}
      <div className="bg-bg-raised border-stroke-subtle min-w-0 rounded-2xl rounded-ss-md border px-3.5 py-2.5">
        {children}
      </div>
    </div>
  );
}

function AssistantMessage({ content, streaming, onNavigate }) {
  return (
    <div
      dir="auto"
      className={`text-text-main font-arabic text-sm leading-relaxed [&>*+*]:mt-2 ${streaming ? "chat-caret" : ""}`}
    >
      <Markdown
        components={{
          a: ({ href, children }) => {
            const isInternal =
              href?.startsWith("/") || href?.startsWith(SITE_URL);
            if (isInternal) {
              return (
                <InternalLink
                  to={href.replace(SITE_URL, "")}
                  onNavigate={onNavigate}
                >
                  {children}
                </InternalLink>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {children}
              </a>
            );
          },
          p: ({ children }) => (
            <p dir="auto" className="text-text-main">
              {children}
            </p>
          ),
          h3: ({ children }) => (
            <h3 className="font-heading text-text-main pt-1 text-sm font-semibold">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="marker:text-text-muted list-disc space-y-1.5 ps-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="marker:text-text-muted list-decimal space-y-2 ps-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-text-main ps-0.5">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="text-text-main font-semibold">{children}</strong>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

function MessageList({
  messages,
  messagesRef,
  isLoading,
  onNavigate,
  announcement,
}) {
  // Open on the newest messages, not the top of an old conversation
  useLayoutEffect(() => {
    const list = messagesRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messagesRef]);

  return (
    <div
      ref={messagesRef}
      className="flex flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto px-4 py-4"
    >
      {messages.map((item, index) => {
        const prevRole = messages[index - 1]?.role;
        // Extra space where the speaker changes
        const gap = index > 0 && prevRole !== item.role ? "mt-2" : "";
        if (item.role === "context")
          return <ContextDivider key={index} game={item.game} />;
        return item.role === "user" ? (
          <div
            key={index}
            dir="auto"
            className={`bg-bg-chip text-text-main font-arabic max-w-[85%] self-end rounded-2xl rounded-ee-md px-3.5 py-2 text-sm whitespace-pre-wrap ${gap}`}
          >
            {item.content}
          </div>
        ) : (
          <div key={index} className={gap}>
            <AssistantRow showAvatar={prevRole !== "assistant"}>
              <AssistantMessage
                content={item.content}
                streaming={item.streaming}
                onNavigate={onNavigate}
              />
            </AssistantRow>
          </div>
        );
      })}
      {isLoading && !messages.at(-1)?.streaming && (
        <div role="status" aria-label="Assistant is typing" className="mt-2">
          <AssistantRow showAvatar>
            <span className="loading loading-dots loading-sm text-text-dim block"></span>
          </AssistantRow>
        </div>
      )}
      {/* Finished replies are read out once; streaming text would be read word by word */}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}

export default MessageList;
