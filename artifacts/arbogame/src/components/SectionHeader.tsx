import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
}

export function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex max-w-3xl flex-col gap-4 ${alignment}`}>
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
      {description ? (
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
