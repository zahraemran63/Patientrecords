"use client";

import { useState } from "react";

type Tab =
  | "progress"
  | "vitals"
  | "procedure"
  | "medication"
  | "labs"
  | "referral";

const tabs: {
  id: Tab;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "progress",
    title: "Progress Notes",
    description: "Doctor notes & photos",
    icon: "📝",
  },
  {
    id: "vitals",
    title: "Vital Signs",
    description: "Temperature, BP & more",
    icon: "♥",
  },
  {
    id: "procedure",
    title: "Procedures",
    description: "Procedures & biopsy",
    icon: "✚",
  },
  {
    id: "medication",
    title: "Medications",
    description: "Current medications",
    icon: "💊",
  },
  {
    id: "labs",
    title: "Lab Tests",
    description: "Laboratory results",
    icon: "🧪",
  },
  {
    id: "referral",
    title: "Referrals",
    description: "Referral information",
    icon: "↗",
  },
];

export default function PatientPage() {
  const [tab, setTab] = useState<Tab>("progress");
  const [showPatientInfo, setShowPatientInfo] = useState(true);
  const [biopsy, setBiopsy] = useState<boolean | null>(null);

  const activeTab = tabs.find((item) => item.id === tab);

  return (
    <main className="min-h-screen bg-[#f3f8f8] text-slate-800">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-4 flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-teal-700"
        >
          <span className="text-lg">←</span>
          Back to Patients
        </button>

        {/* Patient Header */}
        <section className="mb-4 overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_8px_30px_rgba(15,118,110,0.08)]">
          <div className="bg-gradient-to-br from-teal-600 via-teal-600 to-cyan-600 p-5 text-white sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold backdrop-blur">
                PN
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl font-bold sm:text-2xl">
                    Patient Name
                  </h1>

                  <span className="rounded-full bg-emerald-300/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-50">
                    Active
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-teal-50">
                  <span>File #12345</span>
                  <span>•</span>
                  <span>0500000000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setShowPatientInfo(!showPatientInfo)}
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                  Patient Information
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Personal and basic clinical information
                </p>
              </div>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                {showPatientInfo ? "⌃" : "⌄"}
              </span>
            </button>

            {showPatientInfo && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <InfoCard label="File Number" value="12345" />
                <InfoCard label="Phone" value="0500000000" />
                <InfoCard label="Date of Birth" value="12 Mar 1988" />
                <InfoCard label="National ID" value="1098765432" />
                <InfoCard label="Height" value="165 cm" />
                <InfoCard label="Weight" value="65 kg" />
              </div>
            )}
          </div>
        </section>

        {/* Main Clinical Area */}
        <section className="grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)]">
          {/* Section Menu */}
          <aside>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:block lg:space-y-2">
              {tabs.map((item) => {
                const selected = tab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`group w-full rounded-2xl border p-3 text-left transition sm:p-4 ${
                      selected
                        ? "border-teal-200 bg-teal-600 text-white shadow-lg shadow-teal-600/15"
                        : "border-white bg-white text-slate-700 shadow-sm hover:border-teal-100 hover:bg-teal-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm ${
                          selected
                            ? "bg-white/15 text-white"
                            : "bg-teal-50 text-teal-700"
                        }`}
                      >
                        {item.icon}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold sm:text-sm">
                          {item.title}
                        </p>

                        <p
                          className={`mt-0.5 hidden text-[10px] leading-4 sm:block ${
                            selected
                              ? "text-teal-50"
                              : "text-slate-400"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0 rounded-[28px] border border-white bg-white shadow-[0_8px_30px_rgba(15,118,110,0.07)]">
            {/* Content Header */}
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <span>{activeTab?.icon}</span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {activeTab?.title}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {activeTab?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Notes */}
            {tab === "progress" && (
              <div className="p-5 sm:p-6">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Doctor&apos;s Note
                  </label>

                  <textarea
                    className="mt-3 min-h-[150px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                    placeholder="Write your clinical notes here..."
                  />

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      className="flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
                    >
                      Save Note
                    </button>

                    <button
                      type="button"
                      className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      📷 Add Photo
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400">
                    You can take a photo with your phone camera or choose an
                    existing image.
                  </p>
                </div>

                {/* Previous Notes */}
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">
                      Previous Notes
                    </h3>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                      2 Notes
                    </span>
                  </div>

                  <div className="space-y-3">
                    <NoteCard
                      date="18 Aug 2026 • 10:30 AM"
                      note="Patient reports improvement. Continue current treatment and follow up as scheduled."
                    />

                    <NoteCard
                      date="12 Aug 2026 • 09:15 AM"
                      note="Initial assessment completed. Patient advised regarding treatment plan."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Vitals */}
            {tab === "vitals" && (
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <VitalCard
                    label="Temperature"
                    value="36.8"
                    unit="°C"
                    color="orange"
                  />

                  <VitalCard
                    label="Blood Pressure"
                    value="120/80"
                    unit="mmHg"
                    color="red"
                  />

                  <VitalCard
                    label="Heart Rate"
                    value="74"
                    unit="bpm"
                    color="rose"
                  />

                  <VitalCard
                    label="Oxygen Saturation"
                    value="98"
                    unit="%"
                    color="blue"
                  />

                  <VitalCard
                    label="Respiratory Rate"
                    value="16"
                    unit="/min"
                    color="cyan"
                  />

                  <VitalCard
                    label="Weight"
                    value="65"
                    unit="kg"
                    color="emerald"
                  />
                </div>

                <button
                  type="button"
                  className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  + Add Vital Signs
                </button>
              </div>
            )}

            {/* Procedures */}
            {tab === "procedure" && (
              <div className="p-5 sm:p-6">
                <div className="space-y-4">
                  <Field
                    label="Procedure"
                    placeholder="Enter procedure name..."
                  />

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Procedure Details
                    </label>

                    <textarea
                      className="mt-2 min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      placeholder="Describe the procedure..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Does the patient need a biopsy?
                    </label>

                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setBiopsy(true)}
                        className={`rounded-2xl border p-4 text-sm font-semibold transition ${
                          biopsy === true
                            ? "border-teal-300 bg-teal-50 text-teal-700"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        Yes
                      </button>

                      <button
                        type="button"
                        onClick={() => setBiopsy(false)}
                        className={`rounded-2xl border p-4 text-sm font-semibold transition ${
                          biopsy === false
                            ? "border-teal-300 bg-teal-50 text-teal-700"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="h-11 w-full rounded-xl bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    Save Procedure
                  </button>
                </div>
              </div>
            )}

            {/* Medications */}
            {tab === "medication" && (
              <div className="p-5 sm:p-6">
                <div className="space-y-4">
                  <Field
                    label="Medication Name"
                    placeholder="Enter medication..."
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Dose" placeholder="e.g. 500 mg" />
                    <Field label="Frequency" placeholder="e.g. Twice daily" />
                  </div>

                  <Field
                    label="Duration"
                    placeholder="e.g. 7 days"
                  />

                  <Field
                    label="Instructions"
                    placeholder="Additional instructions..."
                  />

                  <button
                    type="button"
                    className="h-11 w-full rounded-xl bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    Add Medication
                  </button>
                </div>
              </div>
            )}

            {/* Labs */}
            {tab === "labs" && (
              <div className="p-5 sm:p-6">
                <div className="space-y-4">
                  <Field
                    label="Test Name"
                    placeholder="e.g. CBC, HbA1c..."
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Result" placeholder="Result" />
                    <Field label="Unit" placeholder="Unit" />
                  </div>

                  <Field
                    label="Reference Range"
                    placeholder="Normal range..."
                  />

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Notes
                    </label>

                    <textarea
                      className="mt-2 min-h-[110px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      placeholder="Additional lab notes..."
                    />
                  </div>

                  <button
                    type="button"
                    className="h-11 w-full rounded-xl bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    Add Lab Test
                  </button>
                </div>
              </div>
            )}

            {/* Referrals */}
            {tab === "referral" && (
              <div className="p-5 sm:p-6">
                <div className="space-y-4">
                  <Field
                    label="Referral To"
                    placeholder="Department or specialist..."
                  />

                  <Field
                    label="Reason"
                    placeholder="Reason for referral..."
                  />

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Referral Notes
                    </label>

                    <textarea
                      className="mt-2 min-h-[140px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      placeholder="Write referral details..."
                    />
                  </div>

                  <button
                    type="button"
                    className="h-11 w-full rounded-xl bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    Save Referral
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------------- Components ---------------- */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function NoteCard({
  date,
  note,
}: {
  date: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold text-teal-600">
          {date}
        </span>

        <span className="h-2 w-2 shrink-0 rounded-full bg-teal-500" />
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {note}
      </p>
    </div>
  );
}

function VitalCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    rose: "bg-rose-50 text-rose-600",
    blue: "bg-blue-50 text-blue-600",
    cyan: "bg-cyan-50 text-cyan-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl text-sm ${colors[color]}`}
      >
        ♥
      </div>

      <p className="text-[10px] font-semibold uppercase leading-4 tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1">
        <span className="text-xl font-bold text-slate-900">{value}</span>

        <span className="ml-1 text-xs font-medium text-slate-400">
          {unit}
        </span>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <input
        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
        placeholder={placeholder}
      />
    </div>
  );
}
