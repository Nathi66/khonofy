import { cn } from "@/lib/utils";

export default function PageShell({ children, className }) {
  return <div className={cn("p-6 space-y-6", className)}>{children}</div>;
}
