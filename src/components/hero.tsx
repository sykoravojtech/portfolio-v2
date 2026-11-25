/** Page header for the inner pages, in the Notebook style. */
export function Hero({
  kicker,
  headline,
  tagline,
  ctas,
  compact = false,
}: {
  kicker?: string;
  headline: React.ReactNode;
  tagline?: React.ReactNode;
  ctas?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="grid-paper border-b border-line">
      <div className={`max-w-[1120px] mx-auto px-6 ${compact ? "py-10 sm:py-14" : "py-14 sm:py-20"}`}>
        <div className="ruler rule-in max-w-[520px] mb-7" aria-hidden="true" />
        {kicker && <div className="kicker text-accent-text mb-4 hero-rise">{kicker}</div>}
        <h1
          className={`${compact ? "text-[32px] sm:text-[44px]" : "text-[40px] sm:text-[60px]"} font-semibold tracking-[-0.035em] leading-[1.03] hero-rise`}
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {headline}
        </h1>
        {tagline && (
          <div className="mt-5 text-muted max-w-[600px] text-[16px] leading-relaxed hero-rise" style={{ "--i": 2 } as React.CSSProperties}>
            {tagline}
          </div>
        )}
        {ctas && <div className="mt-8 flex flex-wrap gap-3">{ctas}</div>}
      </div>
    </section>
  );
}
