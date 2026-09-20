"use client";

import React from "react";
import { IButton } from "../interfaces/components";

const Button = ({ text, icon, onClick }: IButton) => {
  return (
    <button
      onClick={onClick}
      className="flex group items-center gap-2 px-4 py-2 rounded-xl border border-ink/10 bg-surface hover:bg-ink/10 transition-colors text-ink text-sm font-medium"
    >
      {text}
      {icon}
    </button>
  );
};

export default Button;
