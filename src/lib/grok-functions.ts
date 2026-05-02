import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  note: z.string().min(10).max(20000),
});

const MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are a careful clinical reasoning assistant. Given a raw clinical note, produce a structured medical report as STRICT JSON ONLY (no markdown, no prose, no code fences). Schema:
{
  "patient": { "age": string, "sex": string, "history": string[] },
  "chief_complaint": string,
  "symptoms": [{ "name": string, "severity": "mild"|"moderate"|"severe", "duration": string }],
  "vitals": [{ "name": string, "value": string, "flag": "normal"|"abnormal"|"critical" }],
  "diagnoses": [{ "name": string, "icd10": string, "confidence": number, "rationale": string }],
  "recommendations": string[],
  "critical_flags": string[],
  "summary": string
}
Confidence is 0-1. Be conservative; flag critical findings explicitly.`;

export const analyzeClinicalNote = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "GEMINI_API_KEY is not configured on the server." };
    }

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: data.note }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Gemini API error", res.status, text);
        return { ok: false as const, error: `Gemini API error (${res.status}): ${text.slice(0, 300)}` };
      }

      const json = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
        usageMetadata?: Record<string, unknown>;
      };
      const content = json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
      let report: Record<string, unknown> = {};
      try {
        report = JSON.parse(content) as Record<string, unknown>;
      } catch {
        return { ok: false as const, error: "Model returned non-JSON content.", raw: content };
      }
      return {
        ok: true as const,
        report,
        usage: json.usageMetadata ?? null,
        model: MODEL,
      };
    } catch (e) {
      console.error("analyzeClinicalNote failed", e);
      return { ok: false as const, error: e instanceof Error ? e.message : "Unknown error" };
    }
  });
