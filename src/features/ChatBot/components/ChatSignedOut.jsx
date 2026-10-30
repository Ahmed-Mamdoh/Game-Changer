import { Link } from "react-router-dom";
import AssistantMark from "./AssistantMark";

function ChatSignedOut({ onNavigate }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
      <span className="bg-bg-raised border-stroke-subtle flex h-16 w-16 items-center justify-center rounded-full border">
        <AssistantMark size="lg" />
      </span>
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
