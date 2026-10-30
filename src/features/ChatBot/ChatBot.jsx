import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useChat from "./hooks/useChat";
import { useResolveGamePath } from "./hooks/useGamePath";
import ChatTrigger from "./components/ChatTrigger";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import ChatStarters from "./components/ChatStarters";
import ChatSignedOut from "./components/ChatSignedOut";

const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const resolveGamePath = useResolveGamePath();

  // The panel covers the page on phones, so following a link closes it
  function handleNavigate() {
    if (!isDesktop()) setOpen(false);
  }

  // A recommended game opens behind the panel so the pick shows right away
  async function handleRecommend(link) {
    navigate(await resolveGamePath(link));
    handleNavigate();
  }

  const {
    messages,
    input,
    setInput,
    handleSendMessage,
    startNewChat,
    messagesRef,
    isLoading,
    isSignedIn,
    hasConversation,
    starters,
  } = useChat({ onRecommend: handleRecommend });

  return (
    // Non-modal so the page stays usable while the panel is open on desktop
    <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
      <ChatTrigger open={open} />
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          onInteractOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => {
            // Skip the keyboard popping up on phones
            e.preventDefault();
            if (isDesktop()) inputRef.current?.focus();
          }}
          className="bg-bg-surface text-text-main md:border-stroke-medium fixed inset-0 z-[60] flex flex-col md:inset-auto md:right-8 md:bottom-[6.25rem] md:h-[min(40rem,calc(100dvh-9rem))] md:w-[24rem] md:overflow-hidden md:rounded-xl md:border md:shadow-[var(--shadow-float)]"
        >
          <ChatHeader
            onNewChat={startNewChat}
            canReset={isSignedIn && hasConversation}
          />
          {isSignedIn ? (
            <>
              <MessageList
                messages={messages}
                messagesRef={messagesRef}
                isLoading={isLoading}
                onNavigate={handleNavigate}
              />
              <div className="border-stroke-subtle flex flex-col gap-3 border-t p-3">
                {!hasConversation && (
                  <ChatStarters
                    starters={starters}
                    onPick={(text) =>
                      handleSendMessage(text, { isPickRequest: true })
                    }
                  />
                )}
                <ChatInput
                  handleSendMessage={handleSendMessage}
                  input={input}
                  setInput={setInput}
                  inputRef={inputRef}
                  isLoading={isLoading}
                />
              </div>
            </>
          ) : (
            <ChatSignedOut onNavigate={() => setOpen(false)} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
