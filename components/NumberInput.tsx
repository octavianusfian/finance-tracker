"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

export const NumberInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

    if (allowed.includes(e.key)) return;

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <Input ref={ref} {...props} inputMode="numeric" onKeyDown={handleKey} />
  );
});

NumberInput.displayName = "NumberInput";
