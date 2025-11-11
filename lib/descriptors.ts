export const rubric = {
  academicTask1: ["Task Achievement", "Coherence & Cohesion", "Lexical Resource", "Grammatical Range & Accuracy"],
  task2: ["Task Response", "Coherence & Cohesion", "Lexical Resource", "Grammatical Range & Accuracy"],
};

export type Assessment = {
  overallBand: number;
  criteria: Array<{ name: string; band: number; comment: string }>;
  summary: string;
  summaryVi?: string;
};

export function systemPrompt() {
  return `You are an IELTS Writing examiner. Assess the response strictly using official IELTS band descriptors. Output JSON with keys: overallBand (number, 0.0‑9.0), criteria (array of {name, band, comment}), summary (examiner tone). Choose Task 1 vs Task 2 criteria appropriately. Do not include any text outside JSON.`;
}
