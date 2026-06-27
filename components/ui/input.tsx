import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex min-h-10 w-full rounded-md border border-slate-700 bg-slate-950/90 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10",
        className
      )}
      {...props}
    />
  );
}

export { Input };
