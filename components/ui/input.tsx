import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex min-h-12 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-base text-white outline-none transition-colors placeholder:text-slate-500 focus:border-slate-500",
        className
      )}
      {...props}
    />
  );
}

export { Input };
