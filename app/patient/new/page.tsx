"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5" />
    </svg>
  );
}

export default function NewPatientPage() {
  const router = useRouter();

  const [fileNumber, setFileNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!fileNumber.trim() || !name.trim()) {
      setError("File Number and Patient Name are required.");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("clinic_patients")
      .insert({
        file_number: fileNumber.trim(),
        name: name.trim(),
        phone: phone.trim() || null,
        date_of_birth: dateOfBirth || null,
        national_id: nationalId.trim() || null,
        height: height ? Number(height) : null,
        weight: weight ? Number(weight) : null,
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push(`/patient/${data.id}`);
  }

  return (
    <main className="min-h-screen bg-[#f3f8f8] px-4 py-5 text-slate-800">
      <div className="mx-auto w-full max-w-xl">
        {/* Header */}
        <header className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 flex h-10 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-teal-700"
          >
            <ArrowLeftIcon />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/20">
              <UserIcon />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
                Patient Care
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Add New Patient
              </h1>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Enter the patient&apos;s basic information to create a new record.
          </p>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_8px_30px_rgba(15,118,110,0.07)]"
        >
          <div className="space-y-5 p-5 sm:p-6">
            {/* File Number */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                File Number
              </label>

              <input
                type="text"
                value={fileNumber}
                onChange={(e) => setFileNumber(e.target.value)}
                placeholder="e.g. P-1003"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Patient Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter patient name"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 5X XXX XXXX"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Date of Birth
              </label>

              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            {/* National ID */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                National ID
              </label>

              <input
                type="text"
                inputMode="numeric"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="Enter national ID"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            {/* Height + Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Height
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                    cm
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Weight
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-sm leading-5 text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 bg-slate-50/70 p-4">
            <button
              type="submit"
              disabled={saving}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-teal-600 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Patient..." : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
