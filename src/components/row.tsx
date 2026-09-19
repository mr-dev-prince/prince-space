import React from "react";
import HorizontalLines from "./horizontal-lines";

const Row = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className="flex w-full flex-col">
    <HorizontalLines />
    <div className={`px-4 py-4 sm:px-6 ${className}`}>{children}</div>
  </div>
);

export default Row;
