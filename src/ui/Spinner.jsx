function Spinner() {
  return (
    <div
      className="flex min-h-[60dvh] w-full items-center justify-center"
      role="status"
    >
      <span className="loading loading-spinner text-pulse-primary h-8 w-8"></span>
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default Spinner;
