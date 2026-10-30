import chatBotIcon from "@/assets/chatbot-icon.webp";
import { Link } from "react-router-dom";

function ChatSignedOut({ onNavigate }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
      <img
        src={chatBotIcon}
        alt=""
        className="h-14 w-14"
        width={56}
        height={56}
      />
      <h3 className="font-heading text-text-main text-base font-semibold">
        Log in to chat
      </h3>
      <p className="text-text-dim text-sm">
        The assistant reads your library and ratings to pick what you should
        play next.
      </p>
      <Link
        to="/auth"
        onClick={onNavigate}
        className="bg-action text-on-action hover:bg-action-hover mt-1 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-100"
      >
        Log in
      </Link>
    </div>
  );
}

export default ChatSignedOut;
