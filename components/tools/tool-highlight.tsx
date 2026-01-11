"use client";

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function ToolHighlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const tokens = q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  if (tokens.length === 0) return <>{text}</>;
  const pattern = tokens.map(escapeRegExp).join("|");
  const re = new RegExp(`(${pattern})`, "ig");
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, idx) => {
        const isMatch = new RegExp(`^(${pattern})$`, "i").test(part);
        return isMatch ? (
          <mark
            key={`${idx}:${part}`}
            className="rounded bg-primary/15 px-1 py-0.5 text-foreground"
          >
            {part}
          </mark>
        ) : (
          <span key={`${idx}:${part}`}>{part}</span>
        );
      })}
    </>
  );
}
