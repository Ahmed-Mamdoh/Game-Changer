import Markdown from "react-markdown";
import { Link } from "react-router-dom";

function MessageList({ messages, messagesRef, isLoading }) {
  return (
    <div
      ref={messagesRef}
      className="flex max-h-[60dvh] min-h-[30dvh] flex-col gap-2 overflow-x-hidden overflow-y-auto"
    >
      {messages.map((item, index) => {
        if (item.role === "user")
          return (
            <div key={index} className="chat chat-end">
              <div className="chat-bubble bg-bg-chip font-arabic rounded-lg text-sm before:hidden">
                <p dir="auto" className="text-text-main">
                  {item.content}
                </p>
              </div>
            </div>
          );
        if (item.role === "assistant") {
          return (
            <div key={index} className="chat chat-start">
              <div
                dir="auto"
                className="chat-bubble bg-bg-base border-stroke-subtle text-text-main font-arabic rounded-lg border text-sm before:hidden"
              >
                <Markdown
                  components={{
                    a: ({ href, children, ...props }) => {
                      const isInternal =
                        href?.startsWith("/") ||
                        href?.startsWith("https://game-changer-gg.vercel.app");
                      if (isInternal) {
                        const to = href.replace(
                          "https://game-changer-gg.vercel.app",
                          "",
                        );
                        return (
                          <Link
                            to={to}
                            {...props}
                            className="text-text-brand underline underline-offset-2"
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
                          className="text-text-brand underline underline-offset-2"
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    },

                    p: ({ children, ...props }) => (
                      <p {...props} dir="auto" className="text-text-main">
                        {children}
                      </p>
                    ),
                  }}
                >
                  {item.content}
                </Markdown>
              </div>
            </div>
          );
        }
      })}
      {isLoading && (
        <div
          className="chat chat-start"
          role="status"
          aria-label="Assistant is typing"
        >
          <div className="chat-bubble bg-bg-base border-stroke-subtle text-text-dim rounded-lg border before:hidden">
            <span className="loading loading-dots loading-xs"></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageList;
