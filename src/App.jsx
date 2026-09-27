import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Activity,
  Heart,
  Pill,
  ClipboardList,
  UserCheck,
  AlertTriangle,
  PlusCircle,
  FileCheck,
  Download,
  Lock,
  Search,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { useStore } from './store/useStore';

export default function App() {
  const {
    activeRole,
    setActiveRole,
    currentPhysician,
    patient,
    prescriptions,
    labReports,
    clinicalEncounters,
    auditLog,
    addPrescription,
    addEncounter
  } = useStore();

  const [activeTab, setActiveTab] = useState('encounters'); // 'encounters' | 'prescriptions' | 'labs' | 'audit' | 'summary'
  const [showRxModal, setShowRxModal] = useState(false);
  const [showEncModal, setShowEncModal] = useState(false);

  // Form states
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [encComplaint, setEncComplaint] = useState('');
  const [encNotes, setEncNotes] = useState('');
  const [encIcd10, setEncIcd10] = useState('I10');

  const handleCreateRx = (e) => {
    e.preventDefault();
    if (!medName) return;
    addPrescription({ medication: medName, dosage: medDosage });
    setShowRxModal(false);
    setMedName('');
    setMedDosage('');
  };

  const handleCreateEnc = (e) => {
    e.preventDefault();
    if (!encComplaint) return;
    addEncounter({ complaint: encComplaint, notes: encNotes, icd10: encIcd10 });
    setShowEncModal(false);
    setEncComplaint('');
    setEncNotes('');
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-900 flex flex-col font-sans">
      {/* Sterile Clinical Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-clinical-200 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-clinical-800 flex items-center justify-center text-white shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-clinical-900 block leading-none">
                AETNAVAULT EHR
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-clinical-700 font-semibold">
                Sovereign Electronic Health Records & Clinical Registry
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-clinical-50 p-1 rounded-xl border border-clinical-200 text-xs font-semibold text-clinical-800">
            {[
              { id: 'encounters', label: 'Encounters', icon: ClipboardList },
              { id: 'prescriptions', label: 'E-Prescriptions', icon: Pill },
              { id: 'labs', label: 'Diagnostic Labs', icon: Activity },
              { id: 'audit', label: 'Audit Trail', icon: ShieldCheck },
              { id: 'summary', label: 'Health Dossier', icon: FileCheck }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    activeTab === tab.id
                      ? 'bg-clinical-800 text-white font-bold'
                      : 'hover:bg-clinical-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block text-xs font-mono">
              <span className="font-bold text-slate-800 block">
                {activeRole === 'physician' ? currentPhysician.name : patient.name}
              </span>
              <span className="text-[10px] text-clinical-700">
                {activeRole === 'physician' ? currentPhysician.license : `ID: ${patient.id}`}
              </span>
            </div>

            <button
              onClick={() => setActiveRole(activeRole === 'physician' ? 'patient' : 'physician')}
              className="px-3 py-1.5 bg-clinical-100 hover:bg-clinical-200 border border-clinical-300 rounded-xl text-xs font-bold text-clinical-900 transition"
            >
              {activeRole === 'physician' ? 'Switch to Patient View' : 'Switch to Physician View'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-6">
        {/* Patient Demographic & Clinical Alert Banner */}
        <div className="bg-white border border-clinical-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-clinical-100 text-clinical-800 border border-clinical-300">
                DOB: {patient.dob}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Patient ID: {patient.id} • Blood Type: <b className="text-slate-800">{patient.bloodType}</b> • BMI: 23.2 ({patient.height}, {patient.weight})
            </p>
          </div>

          {/* Clinical Allergies Tag */}
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 p-3.5 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-rose-800 uppercase font-mono text-[10px] block">Severe Clinical Allergies:</span>
              <span className="text-rose-700 font-semibold">{patient.allergies.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* VIEW 1: ENCOUNTERS */}
        {activeTab === 'encounters' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Clinical Encounters & Diagnostic Notes</h2>
                <p className="text-xs text-slate-500 font-mono">Physician documented consultations and SOAP notes</p>
              </div>
              {activeRole === 'physician' && (
                <button
                  onClick={() => setShowEncModal(true)}
                  className="px-4 py-2 bg-clinical-800 hover:bg-clinical-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <PlusCircle className="w-4 h-4" /> Add Consultation
                </button>
              )}
            </div>

            <div className="space-y-3">
              {clinicalEncounters.map((enc) => (
                <div key={enc.id} className="p-6 bg-white border border-clinical-200 rounded-2xl shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{enc.chiefComplaint}</h3>
                      <span className="text-xs text-slate-400 font-mono">{enc.date} • Attending: {enc.provider}</span>
                    </div>
                    <span className="px-3 py-1 bg-clinical-50 text-clinical-800 border border-clinical-200 text-xs font-mono font-bold rounded-lg self-start sm:self-auto">
                      ICD-10: {enc.icd10}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {enc.clinicalNotes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: E-PRESCRIPTIONS */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Active E-Prescriptions</h2>
                <p className="text-xs text-slate-500 font-mono">Cryptographically signed dispensations for pharmacy verification</p>
              </div>
              {activeRole === 'physician' && (
                <button
                  onClick={() => setShowRxModal(true)}
                  className="px-4 py-2 bg-clinical-800 hover:bg-clinical-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <PlusCircle className="w-4 h-4" /> E-Sign New Rx
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="p-6 bg-white border border-clinical-200 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase bg-clinical-100 text-clinical-800 font-bold px-2 py-0.5 rounded">
                        {rx.status}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{rx.issuedDate}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-800 pt-1">{rx.medication}</h3>
                    <p className="text-xs text-slate-600 font-mono">Dosage: <b className="text-slate-800">{rx.dosage}</b></p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 space-y-1">
                    <div>Prescriber: {rx.prescribedBy}</div>
                    <div className="text-clinical-700 truncate">Digital Seal: {rx.signedHash}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: DIAGNOSTIC LABS */}
        {activeTab === 'labs' && (
          <div className="space-y-4">
            <div className="border-b border-clinical-200 pb-2">
              <h2 className="text-lg font-bold text-slate-900">Diagnostic Laboratory Panels</h2>
              <p className="text-xs text-slate-500 font-mono">Biochemical biomarker subfractions & reference intervals</p>
            </div>

            <div className="space-y-4">
              {labReports.map((lab) => (
                <div key={lab.id} className="p-6 bg-white border border-clinical-200 rounded-2xl shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{lab.testName}</h3>
                      <span className="text-xs font-mono text-slate-400">Specimen Collected: {lab.date} • Lab: {lab.facility}</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold rounded-lg">
                      Validated by Pathologist
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-clinical-50 border-b border-clinical-200 text-clinical-800">
                        <tr>
                          <th className="p-3">Biomarker Component</th>
                          <th className="p-3">Observed Value</th>
                          <th className="p-3">Reference Range</th>
                          <th className="p-3">Interpretation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {lab.results.map((res, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-800">{res.metric}</td>
                            <td className="p-3 font-bold text-clinical-800">{res.value}</td>
                            <td className="p-3 text-slate-500">{res.normal}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                {res.flag}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="bg-white border border-clinical-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">HIPAA Compliance Access Log</h2>
              <p className="text-xs text-slate-500 font-mono">Immutable audit record capturing every access token and clinical modification</p>
            </div>

            <div className="space-y-2">
              {auditLog.map((aud) => (
                <div key={aud.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-400">{aud.timestamp}</span>
                    <h4 className="font-bold text-slate-800 mt-0.5">{aud.actor} → <b className="text-clinical-800">{aud.action}</b></h4>
                    <span className="text-slate-600 text-[11px]">{aud.resource}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-clinical-100 text-clinical-800 rounded font-bold self-start sm:self-auto text-[10px]">
                    {aud.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: SUMMARY EXPORT */}
        {activeTab === 'summary' && (
          <div className="bg-white border-2 border-clinical-300 rounded-2xl p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-clinical-200 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-clinical-700 font-bold">Official Clinical Extract</span>
                <h2 className="text-xl font-bold text-slate-900">Comprehensive Patient Health Record Dossier</h2>
              </div>
              <button
                onClick={() => alert('PDF Dossier Generated & Encrypted.')}
                className="px-4 py-2 bg-clinical-800 hover:bg-clinical-900 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" /> Download Signed PDF
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono text-slate-700 leading-relaxed">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase">1. Patient Identification & Anamnesis</h4>
                <p>Name: {patient.name} | DOB: {patient.dob} | Blood Type: {patient.bloodType}</p>
                <p>Chronic Diagnoses: {patient.chronicConditions.join(', ')}</p>
                <p>Documented Allergies: {patient.allergies.join(', ')}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase">2. Active Pharmacotherapy Schedule</h4>
                {prescriptions.map((rx) => (
                  <p key={rx.id}>• {rx.medication} — {rx.dosage} (Issued by {rx.prescribedBy})</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: NEW RX */}
      {showRxModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-clinical-300 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-clinical-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">E-Sign Digital Prescription</h3>
              <button onClick={() => setShowRxModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateRx} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-slate-500 block mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lisinopril / Hydrochlorothiazide"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-clinical-700"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-500 block mb-1">Dosage & Sig</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20mg / 12.5mg once daily in the morning"
                  value={medDosage}
                  onChange={(e) => setMedDosage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-clinical-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRxModal(false)}
                  className="w-1/2 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-clinical-800 text-white rounded-xl text-xs font-bold shadow"
                >
                  Cryptographically Sign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW ENCOUNTER */}
      {showEncModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-clinical-300 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-clinical-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Add Clinical Consultation Note</h3>
              <button onClick={() => setShowEncModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateEnc} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-slate-500 block mb-1">Chief Complaint</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quarterly Metabolic Review"
                  value={encComplaint}
                  onChange={(e) => setEncComplaint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-500 block mb-1">ICD-10 Diagnostic Code</label>
                <input
                  type="text"
                  value={encIcd10}
                  onChange={(e) => setEncIcd10(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-500 block mb-1">Clinical SOAP Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Subjective, Objective, Assessment, Plan..."
                  value={encNotes}
                  onChange={(e) => setEncNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEncModal(false)}
                  className="w-1/2 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-clinical-800 text-white rounded-xl text-xs font-bold shadow"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clinical Footer */}
      <footer className="border-t border-clinical-200 bg-white py-6 text-center text-xs text-slate-400 font-mono">
        © 2026 AETNAVAULT EHR SYSTEMS. HIPAA TITLE II / HITECH COMPLIANT RECORD VAULT.
      </footer>
    </div>
  );
}
