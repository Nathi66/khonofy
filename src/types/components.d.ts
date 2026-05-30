import type { ComponentType, ReactNode } from "react";

declare module "@/components/AuthLayout" {
  export interface AuthLayoutProps {
    icon?: ComponentType<{ className?: string }> | null;
    topImage?: string | null;
    topImageAlt?: string;
    topImageClassName?: string;
    title?: ReactNode;
    subtitle?: ReactNode;
    titleInCard?: boolean;
    titleClassName?: string;
    subtitleClassName?: string;
    footer?: ReactNode;
    afterCard?: ReactNode;
    children: ReactNode;
  }

  export default function AuthLayout(props: AuthLayoutProps): JSX.Element;
}
