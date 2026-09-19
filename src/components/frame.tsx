import React from "react";
import VerticalLines from "./vertical-lines";

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-4 min-h-screen pt-16 pb-32 sm:mx-8 md:mx-12 md:pt-52 md:pb-60 lg:mx-16 xl:mx-96">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-px"
    >
      <VerticalLines />
    </div>
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 w-px"
    >
      <VerticalLines />
    </div>
    <div className="relative flex w-full flex-col">{children}</div>
  </div>
);

export default Frame;
