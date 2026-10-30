function ChatStarters({ starters, onPick }) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Suggested questions">
      {starters.map(({ text, isPick }) => (
        <button
          key={text}
          type="button"
          onClick={() => onPick(text, isPick)}
          className="bg-bg-raised border-stroke-subtle text-text-main hover:bg-bg-chip cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-colors duration-100"
        >
          {text}
        </button>
      ))}
    </div>
  );
}

export default ChatStarters;
