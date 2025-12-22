import Markdown from "react-markdown";
import { Link } from "react-router-dom";

function MessageList({ messages, messagesRef }) {
  return (
    <div
      ref={messagesRef}
      className="flex max-h-[60vh] flex-col gap-2 overflow-x-hidden overflow-y-auto"
    >
      {messages.map((item, index) => {
        if (item.role === "user")
          return (
            <div key={index} className="chat chat-start">
              <div className="chat-bubble">{item.content}</div>
            </div>
          );
        if (item.role === "assistant") {
          return (
            <div key={index} className="chat chat-end">
              <div className="chat-bubble bg-primary/70 text-primary-content">
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
                            className="hover:text-secondary/80 text-secondary transform underline transition-colors duration-200"
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
                          className="text-blue-400 underline hover:text-blue-300"
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {item.content}
                </Markdown>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

export default MessageList;
