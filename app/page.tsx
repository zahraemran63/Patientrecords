"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Patient = {
  id: string;
  fileNumber: string;
  name: string;
  dateOfBirth: string;
  nationalId: string;
  phone: string;
};

const demoPatients: Patient[] = [
  {
    id: "demo-1001",
    fileNumber: "P-1001",
    name: "Sarah Ahmed",
    dateOfBirth: "12 Mar 1988",
    nationalId: "1098765432",
    phone: "+966 50 123 4567",
  },
  {
    id: "demo-1002",
    fileNumber: "P-1002",
    name: "Mohammed Ali",
    dateOfBirth: "05 Jul 1979",
    nationalId: "1076543210",
    phone: "+966 55 987 6543",
  },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M12 5v14M5 12h14" />
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
      className="h-5 w-5"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function IdIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="8" cy="11" r="2" />
      <path d="M13 10h5M13 14h4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.6-3.1 2.4-5 5.5-5s4.9 1.9 5.5 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M16 14c2.5.3 4 2 4.5 4.5" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
    >
      <path d="M3 12h4l2.2-6 4.2 12 2.2-6H21" />
    </svg>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState("");

  const filteredPatients = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return demoPatients;

    return demoPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(value) ||
        patient.fileNumber.toLowerCase().includes(value) ||
        patient.nationalId.includes(value)
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-[#f3f8f8] text-slate-800">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute -left-32 top-[45%] h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/20">
                <ActivityIcon />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
                  Clinic
                </p>

                <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Patient Care
                </h1>
              </div>
            </div>

            <Link
  href="/patient/new"
  className="flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-teal-600 px-4 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 active:scale-[0.98]"
>
  <PlusIcon />
  <span className="hidden sm:inline">Add Patient</span>
  <span className="sm:hidden">Add</span>
</Link>

          </div>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
            Manage your patients, clinical notes, vital signs and follow-up
            information in one place.
          </p>
        </header>

        {/* Quick Stats */}
        <section className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Patients
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {demoPatients.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <UsersIcon />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Patient Records
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {demoPatients.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ActivityIcon />
              </div>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="mb-5">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <SearchIcon />
            </div>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, file number or ID..."
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none shadow-sm transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
            />
          </div>
        </section>

        {/* Section title */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Patients</h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {filteredPatients.length} patient
              {filteredPatients.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* Patient Cards */}
        <section className="space-y-4">
          {filteredPatients.map((patient) => (
            <article
              key={patient.id}
              className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_8px_30px_rgba(15,118,110,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(15,118,110,0.11)]"
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700">
                    <UserIcon />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600">
                      File #{patient.fileNumber}
                    </p>

                    <h3 className="mt-0.5 truncate text-lg font-bold text-slate-900">
                      {patient.name}
                    </h3>
                  </div>
                </div>

                {/* Patient basic information */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <CalendarIcon />

                      <span className="text-[11px] font-medium uppercase tracking-wide">
                        Date of Birth
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm font-semibold text-slate-800">
                      {patient.dateOfBirth}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <IdIcon />

                      <span className="text-[11px] font-medium uppercase tracking-wide">
                        National ID
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm font-semibold text-slate-800">
                      {patient.nationalId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card action */}
              <div className="border-t border-slate-100 bg-slate-50/70 p-3">
                <Link
                  href={`/patient/${patient.id}`}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:scale-[0.99]"
                >
                  View Patient
                  <ArrowIcon />
                </Link>
              </div>
            </article>
          ))}

          {/* Empty search state */}
          {filteredPatients.length === 0 && (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <SearchIcon />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-800">
                No patients found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try searching with another name, file number or ID.
              </p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-8 pb-2 text-center">
          <p className="text-[11px] font-medium text-slate-400">
            Patient Care • Clinical Management
          </p>
        </footer>
      </div>
    </main>
  );
}
