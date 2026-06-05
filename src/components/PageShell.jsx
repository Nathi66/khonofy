import { cn } from "@/lib/utils";

export default function PageShell({ children, className = undefined }) {
  return <div className={cn("p-6 space-y-6", className)}>{children}</div>;
}
