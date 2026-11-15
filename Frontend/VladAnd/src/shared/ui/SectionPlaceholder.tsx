interface SectionPlaceholderProps {
  title: string;
}

/** Presentation-only placeholder; has no domain or API logic. */
export function SectionPlaceholder({ title }: SectionPlaceholderProps) {
  return (
    <main className="placeholder-page">
      <h1>{title}</h1>
      <p>This section is coming soon.</p>
    </main>
  );
}
