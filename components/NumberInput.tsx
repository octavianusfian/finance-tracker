"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  onValueChange?: (value: number) => void;
  value?: number | null;
};

export const CurrencyInput = React.forwardRef<HTMLInputElement, Props>(
  ({ value, onValueChange, ...props }, ref) => {
    // Format number → Rp 10.000
    const formatDisplay = (num: number | null | undefined) => {
      if (num === null || num === undefined) return "";
      return new Intl.NumberFormat("id-ID").format(num);
    };

    // Remove non-digit → parse integer
    const parseToNumber = (v: string) => {
      const clean = v.replace(/\D/g, ""); // keep numbers only
      return clean === "" ? 0 : Number(clean);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parseToNumber(e.target.value);

      onValueChange?.(raw); // notify parent with number only
    };

    return (
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          Rp
        </span>

        <Input
          {...props}
          ref={ref}
          value={formatDisplay(value ?? 0)}
          onChange={handleChange}
          className="pl-10" // space for "Rp"
          inputMode="numeric"
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
