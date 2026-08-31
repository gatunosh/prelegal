# Mutual NDA Creator (frontend)

Prototype for **JIRA PL-3** — a web app that turns a short form into a complete,
downloadable Mutual Non-Disclosure Agreement.

## What it does

1. The user fills in the key terms (parties, purpose, effective date, term
   lengths, governing law, jurisdiction).
2. A live preview renders the full agreement: the Common Paper **Mutual NDA
   Cover Page** with the values filled in, followed by the fixed **Mutual NDA
   Standard Terms v1.0**.
3. **Download PDF** opens the browser print dialog with a print stylesheet that
   outputs just the agreement — choose "Save as PDF".

The agreement text comes from the Common Paper templates in
[`../templates/`](../templates) (`Mutual-NDA-coverpage.md` and `Mutual-NDA.md`),
free to use under CC BY 4.0. This is a prototype and does not constitute legal
advice.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- No backend — the page is fully static; everything runs in the browser.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Layout

| Path | Purpose |
| --- | --- |
| `src/app/page.tsx` | Composes the form, the live preview and the download button; holds the form state. |
| `src/components/nda-form.tsx` | The input form. |
| `src/components/nda-document.tsx` | Renders the filled-in agreement (Cover Page + Standard Terms). |
| `src/lib/nda.ts` | Data model, defaults and formatting helpers. |
| `src/lib/standard-terms.ts` | Verbatim Standard Terms v1.0 clauses. |
| `src/app/globals.css` | Document styling and the `@media print` rules. |
