import React from "react";
import { cn } from "@/lib/utils";

export default function AuthLayout({
  icon: Icon,
  topImage,
  topImageAlt = "",
  topImageClassName = "w-28 sm:w-32",
  title,
  subtitle,
  titleInCard = false,
  titleClassName = "",
  subtitleClassName = "",
  footer = null,
  afterCard = null,
  children,
}) {
  const cardHeader = (title || subtitle) ? (
    <div className="text-center mb-6">
      {title ? (
        <h1
          className={cn(
            "font-bold tracking-tight text-foreground",
            titleInCard ? "text-xl sm:text-2xl" : "text-3xl",
            titleClassName
          )}
        >
          {title}
        </h1>
      ) : null}
      {subtitle ? (
        <p
          className={cn(
            "text-muted-foreground",
            titleInCard ? "mt-2 text-xs sm:text-sm leading-relaxed" : "mt-2",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  ) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className={cn("text-center", titleInCard ? "mb-6" : "mb-10")}>
          {topImage ? (
            <div className="flex justify-center mb-5">
              <img
                src={topImage}
                alt={topImageAlt}
                className={cn("h-auto select-none pointer-events-none", topImageClassName)}
              />
            </div>
          ) : null}
          {Icon ? (
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
              <Icon className="w-7 h-7 text-primary-foreground" aria-hidden="true" />
            </div>
          ) : null}
          {!titleInCard ? cardHeader : null}
        </div>

        <div className="overflow-hidden rounded-2xl shadow-sm border border-border">
          <div className="bg-card p-8">
            {titleInCard ? cardHeader : null}
            {children}
          </div>
          {afterCard}
        </div>

        {footer ? (
          <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
        ) : null}
      </div>
    </div>
  );
}
