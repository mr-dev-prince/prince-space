const blurLayer = (blur: string, from: string, to: string) => ({
  className: `absolute inset-0 ${blur}`,
  style: {
    WebkitMaskImage: `linear-gradient(to bottom, transparent ${from}, black ${to})`,
    maskImage: `linear-gradient(to bottom, transparent ${from}, black ${to})`,
  },
});

const BottomFade = () => (
  <div className="pointer-events-none fixed bottom-0 left-0 z-40 hidden h-28 w-full md:block">
    <div {...blurLayer("backdrop-blur-[2px]", "0%", "35%")} />
    <div {...blurLayer("backdrop-blur-[6px]", "35%", "70%")} />
    <div {...blurLayer("backdrop-blur-xl", "70%", "100%")} />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-canvas/50 to-canvas" />
  </div>
);

export default BottomFade;
