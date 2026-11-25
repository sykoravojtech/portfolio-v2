"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { experiences } from "@/content/experiences";
import { CompanyLogo } from "./company-logo";

const Ctx = createContext<(id: string) => void>(() => {});

/** Opens a job's full details in a sheet from the right. */
export function useOpenDetails() {
  return useContext(Ctx);
}

export function DetailsProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const show = useCallback((next: string) => {
    setId(next);
    setOpen(true);
  }, []);
  const job = experiences.find((e) => e.id === id);

  return (
    <Ctx.Provider value={show}>
      {children}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="sheet-overlay fixed inset-0 z-50 bg-ink/40" />
          <Dialog.Content
            className="sheet-panel fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-paper border-l border-rule overflow-y-auto px-6 sm:px-7 pt-5 pb-10 outline-none"
            aria-describedby={undefined}
          >
            {job && (
              <>
                <div className="flex items-center">
                  <span className="kicker text-muted">Experience</span>
                  <Dialog.Close
                    className="press ml-auto size-11 grid place-items-center border border-line bg-card hover:border-rule"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </Dialog.Close>
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <CompanyLogo src={job.logo} name={job.company} size={64} />
                  <div className="min-w-0">
                    <Dialog.Title className="text-[22px] font-semibold tracking-[-0.015em] leading-tight">{job.role}</Dialog.Title>
                    <p className="mt-1 text-[14px] text-muted">
                      {job.link ? (
                        <a href={job.link} target="_blank" rel="noreferrer" className="hover:text-accent-text">
                          {job.company} ↗
                        </a>
                      ) : (
                        job.company
                      )}
                    </p>
                  </div>
                </div>
                <p className="mt-4 font-mono text-[12px] text-muted uppercase">
                  {[job.dateDisplay, job.location, job.modality].filter(Boolean).join(" / ")}
                </p>
                <ul className="mt-5 border-t border-rule">
                  {job.description.map((d, i) => (
                    <li
                      key={d}
                      className="sheet-item flex gap-3 py-3 border-b border-line text-[14px] leading-relaxed"
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      <span className="mt-2 size-1.5 shrink-0 bg-accent" aria-hidden="true" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {job.skills.map((s, i) => (
                    <span
                      key={s}
                      className="sheet-item font-mono text-[10.5px] tracking-[0.06em] uppercase px-2 py-1 border border-ink"
                      style={{ "--i": job.description.length + i * 0.5 } as React.CSSProperties}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Ctx.Provider>
  );
}
