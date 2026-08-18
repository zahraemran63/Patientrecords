"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Tab =
  | "progress"
  | "vitals"
  | "procedure"
  | "medication"
  | "labs"
  | "referral";

type Patient = {
  id: string;
  name: string | null;
  file_number: string | null;
  phone: string | null;
  date_of_birth: string | null;
  national_id: string | null;
  height: number | null;
  weight: number | null;
};

type Note = {
  id: string;
  patient_id: string;
  note: string | null;
  created_at: string;
};

type Vital = {
  id: string;
  patient_id: string;
  recorded_at: string;
  temperature_c: number | null;
  systolic_bp: number | null;
  diastolic_bp: number | null;
  heart_rate_bpm: number | null;
  oxygen_sat_percent: number | null;
  respiratory_rate: number | null;
  weight_kg: number | null;
  notes: string | null;
};

type Procedure = {
  id: string;
  patient_id: string;
  procedure_name: string;
  procedure_details: string | null;
  needs_biopsy: boolean;
  biopsy_details: string | null;
  created_at: string;
};

type Medication = {
  id: string;
  patient_id: string;
  name: string;
  dose: string | null;
  frequency: string | null;
  duration: string | null;
  notes: string | null;
  created_at: string;
};

type Lab = {
  id: string;
  patient_id: string;
  test_name: string;
  order_date: string | null;
  result_value: string | null;
  units: string | null;
  reference_range: string | null;
  notes: string | null;
  created_at: string;
};

type Referral = {
  id: string;
  patient_id: string;
  referral_to: string;
  reason: string | null;
  appointment_date: string | null;
  notes: string | null;
  created_at: string;
};

const tabs: {
  id: Tab;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "progress",
    title: "Progress Notes",
    description: "Doctor notes",
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
  const params = useParams();
  const router = useRouter();

  const patientId = params.id as string;

  const [tab, setTab] = useState<Tab>("progress");
  const [showPatientInfo, setShowPatientInfo] = useState(true);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notes, setNotes] = useState<Note[]>([]);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const [temperature, setTemperature] = useState("");
  const [systolicBP, setSystolicBP] = useState("");
  const [diastolicBP, setDiastolicBP] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [oxygen, setOxygen] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [vitalWeight, setVitalWeight] = useState("");
  const [vitalNotes, setVitalNotes] = useState("");
  const [savingVitals, setSavingVitals] = useState(false);

  const [procedureName, setProcedureName] = useState("");
  const [procedureDetails, setProcedureDetails] = useState("");
  const [biopsy, setBiopsy] = useState<boolean | null>(null);
  const [biopsyDetails, setBiopsyDetails] = useState("");
  const [savingProcedure, setSavingProcedure] = useState(false);

  const [medicationName, setMedicationName] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [savingMedication, setSavingMedication] = useState(false);

  const [testName, setTestName] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [result, setResult] = useState("");
  const [unit, setUnit] = useState("");
  const [referenceRange, setReferenceRange] = useState("");
  const [labNotes, setLabNotes] = useState("");
  const [savingLab, setSavingLab] = useState(false);

  const [referralTo, setReferralTo] = useState("");
  const [referralReason, setReferralReason] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [referralNotes, setReferralNotes] = useState("");
  const [savingReferral, setSavingReferral] = useState(false);

  const activeTab = tabs.find((item) => item.id === tab);

  useEffect(() => {
    if (!patientId) return;

    loadPatient();
  }, [patientId]);

  async function loadPatient() {
    setLoading(true);
    setError("");

    const { data, error: patientError } = await supabase
      .from("clinic_patients")
      .select(
        "id,name,file_number,phone,date_of_birth,national_id,height,weight"
      )
      .eq("id", patientId)
      .single();

    if (patientError) {
      console.error(patientError);
      setError(patientError.message);
      setLoading(false);
      return;
    }

    setPatient(data as Patient);

    await Promise.all([
      loadNotes(),
      loadVitals(),
      loadProcedures(),
      loadMedications(),
      loadLabs(),
      loadReferrals(),
    ]);

    setLoading(false);
  }

  async function loadNotes() {
    const { data, error } = await supabase
      .from("clinic_progress_notes")
      .select("id,patient_id,note,created_at")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Notes error:", error);
      return;
    }

    setNotes((data || []) as Note[]);
  }

  async function loadVitals() {
    const { data, error } = await supabase
      .from("clinic_patient_vitals")
      .select(
        "id,patient_id,recorded_at,temperature_c,systolic_bp,diastolic_bp,heart_rate_bpm,oxygen_sat_percent,respiratory_rate,weight_kg,notes"
      )
      .eq("patient_id", patientId)
      .order("recorded_at", { ascending: false });

    if (error) {
      console.error("Vitals error:", error);
      return;
    }

    setVitals((data || []) as Vital[]);
  }

  async function loadProcedures() {
    const { data, error } = await supabase
      .from("clinic_procedures")
      .select(
        "id,patient_id,created_at,procedure_name,procedure_details,needs_biopsy,biopsy_details"
      )
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Procedures error:", error);
      return;
    }

    setProcedures((data || []) as Procedure[]);
  }

  async function loadMedications() {
    const { data, error } = await supabase
      .from("clinic_medications")
      .select(
        "id,patient_id,created_at,name,dose,frequency,duration,notes"
      )
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Medications error:", error);
      return;
    }

    setMedications((data || []) as Medication[]);
  }

  async function loadLabs() {
    const { data, error } = await supabase
      .from("clinic_labs")
      .select(
        "id,patient_id,created_at,test_name,order_date,result_value,units,reference_range,notes"
      )
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Labs error:", error);
      return;
    }

    setLabs((data || []) as Lab[]);
  }

  async function loadReferrals() {
    const { data, error } = await supabase
      .from("clinic_referrals")
      .select(
        "id,patient_id,created_at,referral_to,reason,appointment_date,notes"
      )
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Referrals error:", error);
      return;
    }

    setReferrals((data || []) as Referral[]);
  }

  async function saveNote() {
    if (!noteText.trim()) {
      alert("Please write a note first.");
      return;
    }

    setSavingNote(true);

    const { error } = await supabase
      .from("clinic_progress_notes")
      .insert({
        patient_id: patientId,
        note: noteText.trim(),
      });

    if (error) {
      console.error(error);
      alert(error.message);
      setSavingNote(false);
      return;
    }

    setNoteText("");
    await loadNotes();

    setSavingNote(false);
  }

  async function saveVitals() {
    if (
      !temperature &&
      !systolicBP &&
      !diastolicBP &&
      !heartRate &&
      !oxygen &&
      !respiratoryRate &&
      !vitalWeight
    ) {
      alert("Please enter at least one vital sign.");
      return;
    }

    setSavingVitals(true);

    const { error } = await supabase
      .from("clinic_patient_vitals")
      .insert({
        patient_id: patientId,
        temperature_c: temperature ? Number(temperature) : null,
        systolic_bp: systolicBP ? Number(systolicBP) : null,
        diastolic_bp: diastolicBP ? Number(diastolicBP) : null,
        heart_rate_bpm: heartRate ? Number(heartRate) : null,
        oxygen_sat_percent: oxygen ? Number(oxygen) : null,
        respiratory_rate: respiratoryRate
          ? Number(respiratoryRate)
          : null,
        weight_kg: vitalWeight ? Number(vitalWeight) : null,
        notes: vitalNotes.trim() || null,
      });

    if (error) {
      console.error(error);
      alert(error.message);
      setSavingVitals(false);
      return;
    }

    setTemperature("");
    setSystolicBP("");
    setDiastolicBP("");
    setHeartRate("");
    setOxygen("");
    setRespiratoryRate("");
    setVitalWeight("");
    setVitalNotes("");

    await loadVitals();

    setSavingVitals(false);
  }

  async function saveProcedure() {
    if (!procedureName.trim()) {
      alert("Please enter the procedure name.");
      return;
    }

    setSavingProcedure(true);

    const { error } = await supabase
      .from("clinic_procedures")
      .insert({
        patient_id: patientId,
        procedure_name: procedureName.trim(),
        procedure_details: procedureDetails.trim() || null,
        needs_biopsy: biopsy ?? false,
        biopsy_details:
          biopsy === true ? biopsyDetails.trim() || null : null,
      });

    if (error) {
      console.error(error);
      alert(error.message);
      setSavingProcedure(false);
      return;
    }

    setProcedureName("");
    setProcedureDetails("");
    setBiopsy(null);
    setBiopsyDetails("");

    await loadProcedures();

    setSavingProcedure(false);
  }

  async function saveMedication() {
    if (!medicationName.trim()) {
      alert("Please enter the medication name.");
      return;
    }

    setSavingMedication(true);

    const { error } = await supabase
      .from("clinic_medications")
      .insert({
        patient_id: patientId,
        name: medicationName.trim(),
        dose: dose.trim() || null,
        frequency: frequency.trim() || null,
        duration: duration.trim() || null,
        notes: instructions.trim() || null,
      });

    if (error) {
      console.error(error);
      alert(error.message);
      setSavingMedication(false);
      return;
    }

    setMedicationName("");
    setDose("");
    setFrequency("");
    setDuration("");
    setInstructions("");

    await loadMedications();

    setSavingMedication(false);
  }

  async function saveLab() {
    if (!testName.trim()) {
      alert("Please enter the test name.");
      return;
    }

    setSavingLab(true);

    const { error } = await supabase
      .from("clinic_labs")
      .insert({
        patient_id: patientId,
        test_name: testName.trim(),
        order_date: orderDate || null,
        result_value: result.trim() || null,
        units: unit.trim() || null,
        reference_range: referenceRange.trim() || null,
        notes: labNotes.trim() || null,
      });

    if (error) {
      console.error(error);
      alert(error.message);
      setSavingLab(false);
      return;
    }

    setTestName("");
    setOrderDate("");
    setResult("");
    setUnit("");
    setReferenceRange("");
    setLabNotes("");

    await loadLabs();

    setSavingLab(false);
  }

  async function saveReferral() {
    if (!referralTo.trim()) {
      alert("Please enter who the patient is being referred to.");
      return;
    }

    setSavingReferral(true);

    const { error } = await supabase
      .from("clinic_referrals")
      .insert({
        patient_id: patientId,
        referral_to: referralTo.trim(),
        reason: referralReason.trim() || null,
        appointment_date: appointmentDate || null,
        notes: referralNotes.trim() || null,
      });

    if (error) {
      console.error(error);
      alert(error.message);
      setSavingReferral(false);
      return;
    }

    setReferralTo("");
    setReferralReason("");
    setAppointmentDate("");
    setReferralNotes("");

    await loadReferrals();

    setSavingReferral(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f8f8]">
        <div className="rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-teal-700 shadow">
          Loading patient...
        </div>
      </main>
    );
  }

  if (error || !patient) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f8f8] px-4">
        <div className="rounded-2xl bg-white p-6 text-center shadow">
          <h1 className="font-bold text-red-600">
            Patient could not be loaded
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error || "Patient not found"}
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-4 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Patients
          </button>
        </div>
      </main>
    );
  }

  const initials =
    patient.name
      ?.split(" ")
      .map((x) => x[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "PN";

  return (
    <main className="min-h-screen bg-[#f3f8f8] text-slate-800">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-4 flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-teal-700"
        >
          <span className="text-lg">←</span>
          Back to Patients
        </button>

        {/* PATIENT HEADER */}

        <section className="mb-4 overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_8px_30px_rgba(15,118,110,0.08)]">
          <div className="bg-gradient-to-br from-teal-600 via-teal-600 to-cyan-600 p-5 text-white sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold backdrop-blur">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl font-bold sm:text-2xl">
                    {patient.name || "Unnamed Patient"}
                  </h1>

                  <span className="rounded-full bg-emerald-300/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-50">
                    Active
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-teal-50">
                  <span>File #{patient.file_number || "-"}</span>
                  <span>•</span>
                  <span>{patient.phone || "No phone"}</span>
                </div>
              </div>
            </div>
          </div>

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
                <InfoCard
                  label="File Number"
                  value={patient.file_number || "-"}
                />

                <InfoCard
                  label="Phone"
                  value={patient.phone || "-"}
                />

                <InfoCard
                  label="Date of Birth"
                  value={
                    patient.date_of_birth
                      ? formatDate(patient.date_of_birth)
                      : "-"
                  }
                />

                <InfoCard
                  label="National ID"
                  value={patient.national_id || "-"}
                />

                <InfoCard
                  label="Height"
                  value={
                    patient.height !== null
                      ? `${patient.height} cm`
                      : "-"
                  }
                />

                <InfoCard
                  label="Weight"
                  value={
                    patient.weight !== null
                      ? `${patient.weight} kg`
                      : "-"
                  }
                />
              </div>
            )}
          </div>
        </section>

        {/* CLINICAL AREA */}

        <section className="grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)]">
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

          <div className="min-w-0 rounded-[28px] border border-white bg-white shadow-[0_8px_30px_rgba(15,118,110,0.07)]">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  {activeTab?.icon}
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

            {/* NOTES */}

            {tab === "progress" && (
              <div className="p-5 sm:p-6">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Doctor&apos;s Note
                  </label>

                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="mt-3 min-h-[150px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                    placeholder="Write your clinical notes here..."
                  />

                  <button
                    type="button"
                    onClick={saveNote}
                    disabled={savingNote}
                    className="mt-3 flex h-11 items-center justify-center rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
                  >
                    {savingNote ? "Saving..." : "Save Note"}
                  </button>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">
                      Previous Notes
                    </h3>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                      {notes.length} Notes
                    </span>
                  </div>

                  <div className="space-y-3">
                    {notes.length === 0 && (
                      <EmptyState text="No notes yet." />
                    )}

                    {notes.map((item) => (
                      <NoteCard
                        key={item.id}
                        date={formatDateTime(item.created_at)}
                        note={item.note || ""}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VITALS */}

            {tab === "vitals" && (
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <InputCard
                    label="Temperature"
                    value={temperature}
                    onChange={setTemperature}
                    unit="°C"
                  />

                  <InputCard
                    label="Systolic BP"
                    value={systolicBP}
                    onChange={setSystolicBP}
                    unit="mmHg"
                  />

                  <InputCard
                    label="Diastolic BP"
                    value={diastolicBP}
                    onChange={setDiastolicBP}
                    unit="mmHg"
                  />

                  <InputCard
                    label="Heart Rate"
                    value={heartRate}
                    onChange={setHeartRate}
                    unit="bpm"
                  />

                  <InputCard
                    label="Oxygen Saturation"
                    value={oxygen}
                    onChange={setOxygen}
                    unit="%"
                  />

                  <InputCard
                    label="Respiratory Rate"
                    value={respiratoryRate}
                    onChange={setRespiratoryRate}
                    unit="/min"
                  />

                  <InputCard
                    label="Weight"
                    value={vitalWeight}
                    onChange={setVitalWeight}
                    unit="kg"
                  />
                </div>

                <TextareaField
                  label="Notes"
                  placeholder="Additional vital signs notes..."
                  value={vitalNotes}
                  onChange={setVitalNotes}
                />

                <button
                  type="button"
                  onClick={saveVitals}
                  disabled={savingVitals}
                  className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
                >
                  {savingVitals
                    ? "Saving..."
                    : "+ Save Vital Signs"}
                </button>

                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-bold">
                    Previous Vital Signs
                  </h3>

                  {vitals.length === 0 && (
                    <EmptyState text="No vital signs recorded yet." />
                  )}

                  <div className="space-y-3">
                    {vitals.map((v) => (
                      <div
                        key={v.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <p className="mb-3 text-[10px] font-semibold text-teal-600">
                          {formatDateTime(v.recorded_at)}
                        </p>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          <MiniValue
                            label="Temp"
                            value={v.temperature_c}
                            unit="°C"
                          />

                          <MiniValue
                            label="BP"
                            value={
                              v.systolic_bp !== null &&
                              v.diastolic_bp !== null
                                ? `${v.systolic_bp}/${v.diastolic_bp}`
                                : null
                            }
                            unit="mmHg"
                          />

                          <MiniValue
                            label="Heart"
                            value={v.heart_rate_bpm}
                            unit="bpm"
                          />

                          <MiniValue
                            label="O₂"
                            value={v.oxygen_sat_percent}
                            unit="%"
                          />

                          <MiniValue
                            label="Resp"
                            value={v.respiratory_rate}
                            unit="/min"
                          />

                          <MiniValue
                            label="Weight"
                            value={v.weight_kg}
                            unit="kg"
                          />
                        </div>

                        {v.notes && (
                          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
                            {v.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PROCEDURES */}

            {tab === "procedure" && (
              <div className="p-5 sm:p-6">
                <div className="space-y-4">
                  <Field
                    label="Procedure"
                    placeholder="Enter procedure name..."
                    value={procedureName}
                    onChange={setProcedureName}
                  />

                  <TextareaField
                    label="Procedure Details"
                    placeholder="Describe the procedure..."
                    value={procedureDetails}
                    onChange={setProcedureDetails}
                  />

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Does the patient need a biopsy?
                    </label>

                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <ChoiceButton
                        active={biopsy === true}
                        onClick={() => setBiopsy(true)}
                      >
                        Yes
                      </ChoiceButton>

                      <ChoiceButton
                        active={biopsy === false}
                        onClick={() => setBiopsy(false)}
                      >
                        No
                      </ChoiceButton>
                    </div>
                  </div>

                  {biopsy === true && (
                    <TextareaField
                      label="Biopsy Details"
                      placeholder="Describe biopsy requirements..."
                      value={biopsyDetails}
                      onChange={setBiopsyDetails}
                    />
                  )}

                  <button
                    type="button"
                    onClick={saveProcedure}
                    disabled={savingProcedure}
                    className="h-11 w-full rounded-xl bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
                  >
                    {savingProcedure
                      ? "Saving..."
                      : "Save Procedure"}
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-bold">
                    Previous Procedures
                  </h3>

                  {procedures.length === 0 && (
                    <EmptyState text="No procedures recorded yet." />
                  )}

                  {procedures.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-800">
                            {p.procedure_name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDateTime(p.created_at)}
                          </p>
                        </div>

                        <span className="text-xs font-semibold text-teal-600">
                          Biopsy: {p.needs_biopsy ? "Yes" : "No"}
                        </span>
                      </div>

                      {p.procedure_details && (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {p.procedure_details}
                        </p>
                      )}

                      {p.biopsy_details && (
                        <div className="mt-3 rounded-xl bg-white p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-teal-600">
                            Biopsy Details
                          </p>

                          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                            {p.biopsy_details}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MEDICATIONS */}

            {tab === "medication" && (
              <div className="p-5 sm:p-6">
                <div className="space-y-4">
                  <Field
                    label="Medication Name"
                    placeholder="Enter medication..."
                    value={medicationName}
                    onChange={setMedicationName}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Dose"
                      placeholder="e.g. 500 mg"
                      value={dose}
                      onChange={setDose}
                    />

                    <Field
                      label="Frequency"
                      placeholder="e.g. Twice daily"
                      value={frequency}
                      onChange={setFrequency}
                    />
                  </div>

                  <Field
                    label="Duration"
                    placeholder="e.g. 7 days"
                    value={duration}
                    onChange={setDuration}
                  />

                  <Field
                    label="Instructions"
                    placeholder="Additional instructions..."
                    value={instructions}
                    onChange={setInstructions}
                  />

                  <button
                    type="button"
                    onClick={saveMedication}
                    disabled={savingMedication}
                    className="h-11 w-full rounded-xl bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
                  >
                    {savingMedication
                      ? "Saving..."
                      : "Add Medication"}
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-bold">
                    Current Medications
                  </h3>

                  {medications.length === 0 && (
                    <EmptyState text="No medications recorded yet." />
                  )}

                  {medications.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <p className="font-bold">
                        {m.name}
                      </p>

                      <p className="mt-1 text-xs text-teal-600">
                        {m.dose || "-"} • {m.frequency || "-"} •{" "}
                        {m.duration || "-"}
                      </p>

                      {m.notes && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                          {m.notes}
                        </p>
                      )}

                      <p className="mt-2 text-[10px] text-slate-400">
                        {formatDateTime(m.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LABS */}

            {tab === "labs" && (
              <div className="p-5 sm:p-6">
                <div className="space-y-4">
                  <Field
                    label="Test Name"
                    placeholder="e.g. CBC, HbA1c..."
                    value={testName}
                    onChange={setTestName}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Order Date
                      </label>

                      <input
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>

                    <Field
                      label="Result"
                      placeholder="Result"
                      value={result}
                      onChange={setResult}
                    />
                  </div>

                  <Field
                    label="Unit"
                    placeholder="Unit"
                    value={unit}
                    onChange={setUnit}
                  />

                  <Field
                    label="Reference Range"
                    placeholder="Normal range..."
                    value={referenceRange}
                    onChange={setReferenceRange}
                  />

                  <TextareaField
                    label="Notes"
                    placeholder="Additional lab notes..."
                    value={labNotes}
                    onChange={setLabNotes}
                  />

                  <button
                    type="button"
                    onClick={saveLab}
                    disabled={savingLab}
                    className="h-11 w-full rounded-xl bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
                  >
                    {savingLab ? "Saving..." : "Add Lab Test"}
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-bold">
                    Previous Lab Tests
                  </h3>

                  {labs.length === 0 && (
                    <EmptyState text="No lab tests recorded yet." />
                  )}

                  {labs.map((lab) => (
                    <div
                      key={lab.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="font-bold">
                            {lab.test_name}
                          </p>

                          {lab.order_date && (
                            <p className="mt-1 text-xs text-teal-600">
                              Ordered: {formatDate(lab.order_date)}
                            </p>
                          )}
                        </div>

                        <span className="text-xs text-slate-400">
                          {formatDateTime(lab.created_at)}
                        </span>
                      </div>

                      <p className="mt-2 text-sm">
                        Result:{" "}
                        <strong>{lab.result_value || "-"}</strong>{" "}
                        {lab.units || ""}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Reference: {lab.reference_range || "-"}
                      </p>

                      {lab.notes && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                          {lab.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REFERRALS */}

            {tab === "referral" && (
              <div className="p-5 sm:p-6">
                <div className="space-y-4">
                  <Field
                    label="Referral To"
                    placeholder="Department or specialist..."
                    value={referralTo}
                    onChange={setReferralTo}
                  />

                  <Field
                    label="Reason"
                    placeholder="Reason for referral..."
                    value={referralReason}
                    onChange={setReferralReason}
                  />

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Appointment Date
                    </label>

                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) =>
                        setAppointmentDate(e.target.value)
                      }
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>

                  <TextareaField
                    label="Referral Notes"
                    placeholder="Write referral details..."
                    value={referralNotes}
                    onChange={setReferralNotes}
                  />

                  <button
                    type="button"
                    onClick={saveReferral}
                    disabled={savingReferral}
                    className="h-11 w-full rounded-xl bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
                  >
                    {savingReferral
                      ? "Saving..."
                      : "Save Referral"}
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-bold">
                    Previous Referrals
                  </h3>

                  {referrals.length === 0 && (
                    <EmptyState text="No referrals recorded yet." />
                  )}

                  {referrals.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <p className="font-bold">
                        {r.referral_to}
                      </p>

                      <p className="mt-1 text-xs text-teal-600">
                        {formatDateTime(r.created_at)}
                      </p>

                      {r.appointment_date && (
                        <p className="mt-2 text-sm">
                          <strong>Appointment:</strong>{" "}
                          {formatDate(r.appointment_date)}
                        </p>
                      )}

                      {r.reason && (
                        <p className="mt-2 text-sm">
                          <strong>Reason:</strong> {r.reason}
                        </p>
                      )}

                      {r.notes && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                          {r.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

/* ================= COMPONENTS ================= */

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

      <p className="mt-1 break-words text-sm font-bold text-slate-800">
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

      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
        {note}
      </p>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
        placeholder={placeholder}
      />
    </div>
  );
}

function TextareaField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
        placeholder={placeholder}
      />
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-sm font-semibold transition ${
        active
          ? "border-teal-300 bg-teal-50 text-teal-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function InputCard({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="mb-2 text-[10px] font-semibold uppercase leading-4 tracking-wide text-slate-400">
        {label}
      </p>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-lg font-bold outline-none focus:border-teal-400"
        />

        <span className="shrink-0 text-xs text-slate-400">
          {unit}
        </span>
      </div>
    </div>
  );
}

function MiniValue({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number | null;
  unit: string;
}) {
  return (
    <div className="rounded-xl bg-white p-2">
      <p className="text-[9px] uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold">
        {value ?? "-"}{" "}
        {value !== null && value !== undefined && (
          <span className="text-[10px] font-normal text-slate-400">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
