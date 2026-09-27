import { create } from 'zustand';

export const useStore = create((set, get) => ({
  activeRole: 'physician', // 'physician' | 'patient' | 'auditor'

  currentPhysician: {
    id: 'DOC-4401-MD',
    name: 'Dr. Aris Thorne, MD',
    specialty: 'Cardiovascular Medicine & Critical Diagnostics',
    license: 'NY-MED-992104'
  },

  patient: {
    id: 'PT-88201',
    name: 'Alexander Vance',
    dob: '1984-06-14',
    bloodType: 'O Negative',
    height: '184 cm',
    weight: '78.5 kg',
    allergies: ['Penicillin G (Anaphylactoid)', 'Sulfa Compounds'],
    chronicConditions: ['Primary Mild Essential Hypertension', 'Hyperlipidemia'],
    emergencyContact: 'Elena Rostova (+1-555-0192)'
  },

  prescriptions: [
    {
      id: 'rx-101',
      medication: 'Telmisartan / Amlodipine',
      dosage: '40mg / 5mg daily PO',
      prescribedBy: 'Dr. Aris Thorne, MD',
      issuedDate: '2026-09-12',
      status: 'Active Dispensation',
      signedHash: '0x99e2a...c01f'
    },
    {
      id: 'rx-102',
      medication: 'Rosuvastatin Calcium',
      dosage: '10mg once daily QHS',
      prescribedBy: 'Dr. Aris Thorne, MD',
      issuedDate: '2026-08-01',
      status: 'Active Dispensation',
      signedHash: '0x33b11...88ab'
    }
  ],

  labReports: [
    {
      id: 'lab-901',
      testName: 'Comprehensive Metabolic Panel (CMP-14)',
      date: '2026-09-20',
      facility: 'Metro Health Central Diagnostics',
      results: [
        { metric: 'Serum Creatinine', value: '0.92 mg/dL', normal: '0.70 - 1.30 mg/dL', flag: 'Normal' },
        { metric: 'eGFR (CKD-EPI)', value: '> 90 mL/min/1.73m²', normal: '> 60 mL/min', flag: 'Optimal' },
        { metric: 'Serum Potassium', value: '4.3 mmol/L', normal: '3.5 - 5.0 mmol/L', flag: 'Normal' },
        { metric: 'Fasting Plasma Glucose', value: '92 mg/dL', normal: '70 - 99 mg/dL', flag: 'Normal' }
      ]
    },
    {
      id: 'lab-902',
      testName: 'High-Sensitivity Cardiac Troponin I & Lipid Subfractions',
      date: '2026-08-15',
      facility: 'Cardiovascular Biomarker Center',
      results: [
        { metric: 'Apolipoprotein B (ApoB)', value: '72 mg/dL', normal: '< 80 mg/dL', flag: 'Normal' },
        { metric: 'hs-CRP', value: '0.6 mg/L', normal: '< 1.0 mg/L', flag: 'Low Cardiovascular Risk' }
      ]
    }
  ],

  clinicalEncounters: [
    {
      id: 'enc-201',
      date: '2026-09-20',
      provider: 'Dr. Aris Thorne, MD',
      chiefComplaint: 'Routine 6-Month Cardiovascular Follow-Up',
      clinicalNotes: 'Patient asymptomatic. Ambulatory BP 118/74 mmHg. Medication tolerance excellent. Advised continued aerobic conditioning.',
      icd10: 'I10 (Essential Primary Hypertension)'
    }
  ],

  auditLog: [
    { id: 'aud-1', timestamp: '2026-09-27 10:14:02 UTC', actor: 'Dr. Aris Thorne, MD (DOC-4401)', action: 'READ_EHR_RECORD', resource: 'Patient PT-88201 Full Chart', status: 'Compliant // Verified' },
    { id: 'aud-2', timestamp: '2026-09-20 14:30:10 UTC', actor: 'Metro Lab Diagnostics (LAB-SYS)', action: 'APPEND_LAB_REPORT', resource: 'CMP-14 Panel Lab-901', status: 'Compliant // Signed' }
  ],

  // Actions
  setActiveRole: (role) => set({ activeRole: role }),

  addPrescription: (rxData) => set((state) => {
    const signedToken = `0x${Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const newRx = {
      id: `rx-${Date.now()}`,
      medication: rxData.medication,
      dosage: rxData.dosage,
      prescribedBy: state.currentPhysician.name,
      issuedDate: new Date().toISOString().slice(0, 10),
      status: 'Active Dispensation',
      signedHash: signedToken
    };

    const newAudit = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      actor: `${state.currentPhysician.name} (${state.currentPhysician.id})`,
      action: 'E_SIGN_PRESCRIPTION',
      resource: `Rx #${newRx.id} (${newRx.medication})`,
      status: 'Compliant // Cryptographically Sealed'
    };

    return {
      prescriptions: [newRx, ...state.prescriptions],
      auditLog: [newAudit, ...state.auditLog]
    };
  }),

  addEncounter: (notesData) => set((state) => {
    const newEnc = {
      id: `enc-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      provider: state.currentPhysician.name,
      chiefComplaint: notesData.complaint,
      clinicalNotes: notesData.notes,
      icd10: notesData.icd10 || 'Z00.00'
    };

    const newAudit = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      actor: `${state.currentPhysician.name} (${state.currentPhysician.id})`,
      action: 'APPEND_CLINICAL_NOTE',
      resource: `Encounter #${newEnc.id}`,
      status: 'Compliant // Audited'
    };

    return {
      clinicalEncounters: [newEnc, ...state.clinicalEncounters],
      auditLog: [newAudit, ...state.auditLog]
    };
  })
}));
