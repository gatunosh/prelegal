import { Fragment, type ReactNode } from "react";

import {
  describeConfidentialityTerm,
  describeMndaTerm,
  formatEffectiveDate,
  orBlank,
  type NdaData,
  type PartyDetails,
} from "@/lib/nda";
import {
  STANDARD_TERMS,
  STANDARD_TERMS_LICENSE_URL,
  STANDARD_TERMS_URL,
  STANDARD_TERMS_VERSION,
} from "@/lib/standard-terms";

/** Renders `**bold**` spans in otherwise plain legal text. */
function renderRichText(text: string): ReactNode {
  return text.split("**").map((chunk, index) =>
    index % 2 === 1 ? (
      <strong key={index}>{chunk}</strong>
    ) : (
      <Fragment key={index}>{chunk}</Fragment>
    ),
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="nda-field">
      <div className="nda-field-label">{label}</div>
      <div className="nda-field-value">{children}</div>
    </div>
  );
}

function partyLabel(party: PartyDetails, fallback: string): string {
  return party.company.trim() || fallback;
}

function SignatureColumn({
  party,
  fallback,
  effectiveDate,
}: {
  party: PartyDetails;
  fallback: string;
  effectiveDate: string;
}) {
  return (
    <div className="nda-signature-col">
      <div className="nda-signature-party">{partyLabel(party, fallback)}</div>
      <dl>
        <div>
          <dt>Signature</dt>
          <dd className="nda-signature-line" />
        </div>
        <div>
          <dt>Print Name</dt>
          <dd>{orBlank(party.signatoryName)}</dd>
        </div>
        <div>
          <dt>Title</dt>
          <dd>{orBlank(party.signatoryTitle)}</dd>
        </div>
        <div>
          <dt>Company</dt>
          <dd>{orBlank(party.company)}</dd>
        </div>
        <div>
          <dt>Notice Address</dt>
          <dd>{orBlank(party.noticeAddress)}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatEffectiveDate(effectiveDate)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function NdaDocument({ data }: { data: NdaData }) {
  const party1Fallback = "Party 1";
  const party2Fallback = "Party 2";

  return (
    <article className="nda-document" aria-label="Mutual Non-Disclosure Agreement preview">
      <header className="nda-doc-header">
        <h1>Mutual Non-Disclosure Agreement</h1>
        <p className="nda-doc-subtitle">Cover Page</p>
      </header>

      <p className="nda-intro">
        This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists of: (1) this
        Cover Page and (2) the Common Paper Mutual NDA Standard Terms Version{" "}
        {STANDARD_TERMS_VERSION}, identical to those posted at{" "}
        <a href={STANDARD_TERMS_URL}>{STANDARD_TERMS_URL.replace("https://", "")}</a>. Any
        modifications of the Standard Terms are made on this Cover Page, which controls over
        conflicts with the Standard Terms.
      </p>

      <section className="nda-section">
        <Field label="Parties">
          <strong>{partyLabel(data.party1, party1Fallback)}</strong> and{" "}
          <strong>{partyLabel(data.party2, party2Fallback)}</strong>
        </Field>
        <Field label="Purpose — how Confidential Information may be used">
          {orBlank(data.purpose)}
        </Field>
        <Field label="Effective Date">{formatEffectiveDate(data.effectiveDate)}</Field>
        <Field label="MNDA Term — the length of this MNDA">
          {describeMndaTerm(data)}
        </Field>
        <Field label="Term of Confidentiality — how long Confidential Information is protected">
          {describeConfidentialityTerm(data)}
        </Field>
        <Field label="Governing Law">{orBlank(data.governingLaw)}</Field>
        <Field label="Jurisdiction">{orBlank(data.jurisdiction)}</Field>
        <Field label="MNDA Modifications">
          {data.modifications.trim() || "None."}
        </Field>
      </section>

      <p className="nda-attestation">
        By signing this Cover Page, each party agrees to enter into this MNDA as of the
        Effective Date.
      </p>

      <section className="nda-signatures">
        <SignatureColumn
          party={data.party1}
          fallback={party1Fallback}
          effectiveDate={data.effectiveDate}
        />
        <SignatureColumn
          party={data.party2}
          fallback={party2Fallback}
          effectiveDate={data.effectiveDate}
        />
      </section>

      <div className="nda-page-break" />

      <header className="nda-doc-header">
        <h2>Mutual NDA Standard Terms</h2>
        <p className="nda-doc-subtitle">Version {STANDARD_TERMS_VERSION}</p>
      </header>

      <ol className="nda-terms">
        {STANDARD_TERMS.map((clause) => (
          <li key={clause.number}>
            <span className="nda-term-title">{clause.title}.</span>{" "}
            {renderRichText(clause.body)}
          </li>
        ))}
      </ol>

      <footer className="nda-doc-footer">
        Common Paper Mutual Non-Disclosure Agreement (Version {STANDARD_TERMS_VERSION}), free
        to use under{" "}
        <a href={STANDARD_TERMS_LICENSE_URL}>CC BY 4.0</a>.
      </footer>
    </article>
  );
}
