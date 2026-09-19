const Dot = ({ side }: { side: "left" | "right" }) => (
  <span
    className={`absolute top-1/2 h-0.5 w-0.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_1px_rgba(255,255,255,0.8)] ${
      side === "left"
        ? "left-[0.5px] -translate-x-1/2"
        : "right-[0.5px] translate-x-1/2"
    }`}
  />
);

const HorizontalLines = ({ className = "" }: { className?: string }) => (
  <div aria-hidden className={`relative h-px w-full ${className}`}>
    <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:5px_2px] bg-repeat-x" />
    <Dot side="left" />
    <Dot side="right" />
  </div>
);

export default HorizontalLines;
