"use client";

import { useEffect, useState } from "react";

import { NdaDocument } from "@/components/nda-document";
import { NdaForm } from "@/components/nda-form";
import { Button } from "@/components/ui/button";
import { createDefaultNdaData, todayIso, type NdaData } from "@/lib/nda";

export default function Home() {
  const [data, setData] = useState<NdaData>(createDefaultNdaData);

  // Default the Effective Date to today, but only after mount: "today" is a
  // client-only value, so seeding it during render would break hydration
  // against the statically prerendered HTML.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount default from a browser-only value
    setData((current) =>
      current.effectiveDate
        ? current
        : { ...current, effectiveDate: todayIso() },
    );
  }, []);

  return (
    <div className="flex min-h-full flex-col">
      <header className="no-print border-b bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Mutual NDA Creator</h1>
            <p className="text-sm text-muted-foreground">
              Fill in the key terms, preview the agreement, and download it as a PDF.
            </p>
          </div>
          <Button type="button" onClick={() => window.print()}>
            Download PDF
          </Button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-6 py-8 lg:grid-cols-[minmax(0,380px)_1fr]">
        <section className="no-print" aria-label="Agreement details">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Agreement details
          </h2>
          <NdaForm data={data} onChange={setData} />
        </section>

        <section aria-label="Agreement preview" className="min-w-0">
          <h2 className="no-print mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Preview
          </h2>
          <div className="nda-preview-frame">
            <NdaDocument data={data} />
          </div>
        </section>
      </main>

      <footer className="no-print border-t bg-background">
        <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-muted-foreground">
          Prototype for JIRA PL-3. Template: Common Paper Mutual NDA v1.0 (CC BY 4.0). Not
          legal advice.
        </div>
      </footer>
    </div>
  );
}
