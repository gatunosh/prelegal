"use client";

import { type ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { NdaData, PartyDetails } from "@/lib/nda";

type PartyKey = "party1" | "party2";

function FormRow({
  htmlFor,
  label,
  hint,
  children,
}: {
  htmlFor: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {children}
    </div>
  );
}

function PartyFieldset({
  legend,
  idPrefix,
  party,
  onChange,
}: {
  legend: string;
  idPrefix: string;
  party: PartyDetails;
  onChange: (patch: Partial<PartyDetails>) => void;
}) {
  return (
    <fieldset className="grid gap-4">
      <legend className="text-sm font-semibold">{legend}</legend>
      <FormRow htmlFor={`${idPrefix}-company`} label="Company / legal name">
        <Input
          id={`${idPrefix}-company`}
          value={party.company}
          onChange={(event) => onChange({ company: event.target.value })}
          placeholder="Acme, Inc."
        />
      </FormRow>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow htmlFor={`${idPrefix}-name`} label="Signatory name">
          <Input
            id={`${idPrefix}-name`}
            value={party.signatoryName}
            onChange={(event) => onChange({ signatoryName: event.target.value })}
            placeholder="Jane Doe"
          />
        </FormRow>
        <FormRow htmlFor={`${idPrefix}-title`} label="Signatory title">
          <Input
            id={`${idPrefix}-title`}
            value={party.signatoryTitle}
            onChange={(event) => onChange({ signatoryTitle: event.target.value })}
            placeholder="CEO"
          />
        </FormRow>
      </div>
      <FormRow
        htmlFor={`${idPrefix}-address`}
        label="Notice address"
        hint="Email or postal address for legal notices."
      >
        <Textarea
          id={`${idPrefix}-address`}
          value={party.noticeAddress}
          onChange={(event) => onChange({ noticeAddress: event.target.value })}
          placeholder="legal@acme.com"
          rows={2}
        />
      </FormRow>
    </fieldset>
  );
}

export function NdaForm({
  data,
  onChange,
}: {
  data: NdaData;
  onChange: (next: NdaData) => void;
}) {
  function update<K extends keyof NdaData>(key: K, value: NdaData[K]) {
    onChange({ ...data, [key]: value });
  }

  function updateParty(key: PartyKey, patch: Partial<PartyDetails>) {
    onChange({ ...data, [key]: { ...data[key], ...patch } });
  }

  function updateYears(
    key: "mndaTermYears" | "confidentialityTermYears",
    raw: string,
  ) {
    const parsed = Number.parseInt(raw, 10);
    update(key, Number.isFinite(parsed) && parsed > 0 ? parsed : 1);
  }

  return (
    <form className="grid gap-8" onSubmit={(event) => event.preventDefault()}>
      <FormRow
        htmlFor="purpose"
        label="Purpose"
        hint="How Confidential Information may be used."
      >
        <Textarea
          id="purpose"
          value={data.purpose}
          onChange={(event) => update("purpose", event.target.value)}
          rows={2}
        />
      </FormRow>

      <FormRow htmlFor="effectiveDate" label="Effective Date">
        <Input
          id="effectiveDate"
          type="date"
          value={data.effectiveDate}
          onChange={(event) => update("effectiveDate", event.target.value)}
          className="w-fit"
        />
      </FormRow>

      <div className="grid gap-2">
        <span className="text-sm font-medium">MNDA Term</span>
        <p className="text-xs text-muted-foreground">The length of this MNDA.</p>
        <RadioGroup
          value={data.mndaTermType}
          onValueChange={(value) =>
            update("mndaTermType", value as NdaData["mndaTermType"])
          }
          className="gap-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <RadioGroupItem value="expires" id="mnda-expires" />
            <Label htmlFor="mnda-expires" className="font-normal">
              Expires
            </Label>
            <Input
              type="number"
              min={1}
              value={data.mndaTermYears}
              disabled={data.mndaTermType !== "expires"}
              onChange={(event) => updateYears("mndaTermYears", event.target.value)}
              className="w-16"
              aria-label="MNDA term in years"
            />
            <span className="text-sm">year(s) from the Effective Date</span>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="untilTerminated" id="mnda-until" />
            <Label htmlFor="mnda-until" className="font-normal">
              Continues until terminated
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-medium">Term of Confidentiality</span>
        <p className="text-xs text-muted-foreground">
          How long Confidential Information is protected.
        </p>
        <RadioGroup
          value={data.confidentialityTermType}
          onValueChange={(value) =>
            update(
              "confidentialityTermType",
              value as NdaData["confidentialityTermType"],
            )
          }
          className="gap-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <RadioGroupItem value="years" id="conf-years" />
            <Label htmlFor="conf-years" className="font-normal">
              For
            </Label>
            <Input
              type="number"
              min={1}
              value={data.confidentialityTermYears}
              disabled={data.confidentialityTermType !== "years"}
              onChange={(event) =>
                updateYears("confidentialityTermYears", event.target.value)
              }
              className="w-16"
              aria-label="Term of confidentiality in years"
            />
            <span className="text-sm">year(s) from the Effective Date</span>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="perpetuity" id="conf-perpetuity" />
            <Label htmlFor="conf-perpetuity" className="font-normal">
              In perpetuity
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow
          htmlFor="governingLaw"
          label="Governing Law"
          hint="U.S. state whose law governs."
        >
          <Input
            id="governingLaw"
            value={data.governingLaw}
            onChange={(event) => update("governingLaw", event.target.value)}
            placeholder="Delaware"
          />
        </FormRow>
        <FormRow
          htmlFor="jurisdiction"
          label="Jurisdiction"
          hint="City or county and state for courts."
        >
          <Input
            id="jurisdiction"
            value={data.jurisdiction}
            onChange={(event) => update("jurisdiction", event.target.value)}
            placeholder="New Castle, DE"
          />
        </FormRow>
      </div>

      <FormRow
        htmlFor="modifications"
        label="MNDA Modifications"
        hint="Optional. Any changes to the Standard Terms."
      >
        <Textarea
          id="modifications"
          value={data.modifications}
          onChange={(event) => update("modifications", event.target.value)}
          rows={2}
          placeholder="None"
        />
      </FormRow>

      <PartyFieldset
        legend="Party 1"
        idPrefix="party1"
        party={data.party1}
        onChange={(patch) => updateParty("party1", patch)}
      />
      <PartyFieldset
        legend="Party 2"
        idPrefix="party2"
        party={data.party2}
        onChange={(patch) => updateParty("party2", patch)}
      />
    </form>
  );
}
