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
    <section className={`bg-green text-bone border-b border-cedar/30`}>
      <div
        className={`max-w-[1120px] mx-auto px-6 ${
          compact ? "py-10 sm:py-14" : "py-14 sm:py-20"
        }`}
      >
        {kicker && (
          <div className="text-[10px] uppercase tracking-[0.16em] text-bone/55 mb-4">
            {kicker}
          </div>
        )}
        <h1
          className={`${
            compact ? "text-[32px] sm:text-[44px]" : "text-[44px] sm:text-[64px]"
          } font-black tracking-[-0.035em] leading-[1.02] text-bone`}
        >
          {headline}
        </h1>
        {tagline && <div className="mt-5 text-bone/70 max-w-[560px] text-[14px] leading-relaxed">{tagline}</div>}
        {ctas && <div className="mt-8 flex flex-wrap gap-3">{ctas}</div>}
      </div>
    </section>
  );
}
