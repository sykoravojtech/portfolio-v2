import type { Certification } from "@/content/types";

export function CertificationCard({ item }: { item: Certification }) {
  return (
    <div className="bg-bg2 border border-border rounded-xl p-4 flex flex-col gap-2">
      <div className="text-[10px] uppercase tracking-[0.12em] text-muted">{item.issuer}</div>
      <div className="text-[13px] font-bold text-ink leading-snug">{item.title}</div>
      <div className="text-[11px] text-muted">{item.issuedAt}</div>
      {item.credentialUrl && (
        <a
          href={item.credentialUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] font-semibold text-green-mid hover:text-bordeaux mt-auto"
        >
          See credential →
        </a>
      )}
    </div>
  );
}
