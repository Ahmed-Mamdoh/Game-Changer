import Markdown from "react-markdown";
import { Link } from "react-router-dom";

const SITE_URL = "https://game-changer-gg.vercel.app";
const linkClass = "text-text-brand underline underline-offset-2";

function AssistantMessage({ content, onNavigate }) {
  return (
    <div
      dir="auto"
      className="text-text-main font-arabic text-sm leading-relaxed [&>*+*]:mt-2"
    >
      <Markdown
        components={{
          a: ({ href, children }) => {
            const isInternal =
              href?.startsWith("/") || href?.startsWith(SITE_URL);
            if (isInternal) {
              return (
                <Link
                  to={href.replace(SITE_URL, "")}
                  onClick={onNavigate}
                  className={linkClass}
                >
                  {children}
                </Link>
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
          p: ({ children }) => <p dir="auto">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 ps-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 ps-5">{children}</ol>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

function MessageList({ messages, messagesRef, isLoading, onNavigate }) {
  return (
    <div
      ref={messagesRef}
      className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto px-4 py-4"
    >
      {messages.map((item, index) =>
        item.role === "user" ? (
          <div
            key={index}
            dir="auto"
            className="bg-bg-chip text-text-main font-arabic max-w-[85%] self-end rounded-2xl rounded-ee-md px-3 py-2 text-sm whitespace-pre-wrap"
          >
            {item.content}
          </div>
        ) : (
          <AssistantMessage
            key={index}
            content={item.content}
            onNavigate={onNavigate}
          />
        ),
      )}
      {isLoading && (
        <div
          role="status"
          aria-label="Assistant is typing"
          className="text-text-dim"
        >
          <span className="loading loading-dots loading-sm"></span>
        </div>
      )}
    </div>
  );
}

export default MessageList;
