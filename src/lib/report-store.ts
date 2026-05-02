// Lightweight session-scoped store for the most recent generated report.
const KEY = "cwa:last-report";

export type GrokReport = {
  patient?: { age?: string; sex?: string; history?: string[] };
  chief_complaint?: string;
  symptoms?: { name: string; severity?: string; duration?: string }[];
  vitals?: { name: string; value: string; flag?: string }[];
  diagnoses?: { name: string; icd10?: string; confidence?: number; rationale?: string }[];
  recommendations?: string[];
  critical_flags?: string[];
  summary?: string;
  [k: string]: unknown;
};

export type StoredReport = {
  id: string;
  createdAt: string;
  note: string;
  report: GrokReport;
  model?: string;
  usage?: { total_tokens?: number } | null;
};

export function saveReport(r: StoredReport) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(r));
  } catch {
    /* ignore */
  }
}

export function loadReport(): StoredReport | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredReport) : null;
  } catch {
    return null;
  }
}
