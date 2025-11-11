import { NextRequest, NextResponse } from "next/server";
import { rubric, systemPrompt, type Assessment } from "../../../lib/descriptors";
import { z } from "zod";

const Body = z.object({
  question: z.object({ id: z.string(), module: z.enum(["Academic", "General"]), task: z.number(), prompt: z.string(), minutes: z.number() }),
  answer: z.string().min(1),
  vietnamese: z.boolean().optional()
});

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const { question, answer, vietnamese } = parsed.data;

  const criteria = question.task === 1 && question.module === "Academic" ? rubric.academicTask1 : rubric.task2;

  const messages = [
    { role: "system", content: systemPrompt() },
    { role: "user", content: `Question (Module: ${question.module}, Task ${question.task}):\n${question.prompt}` },
    { role: "user", content: `Student Answer:\n${answer}` },
    { role: "user", content: `Use criteria: ${criteria.join(", ")}. Return compact JSON only.` }
  ];

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });

  const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages
    })
  });

  const data = await chatRes.json();
  const raw = data?.choices?.[0]?.message?.content ?? "{}";
  let assessment: Assessment;
  try { assessment = JSON.parse(raw); }
  catch { return NextResponse.json({ error: "Model response parse error", raw }, { status: 502 }); }

  if (vietnamese && assessment?.summary) {
    const tRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: "Translate into natural Vietnamese suitable for IELTS feedback. Output text only." },
          { role: "user", content: assessment.summary }
        ]
      })
    });
    const tData = await tRes.json();
    assessment.summaryVi = tData?.choices?.[0]?.message?.content ?? "";
  }

  return NextResponse.json(assessment);
}
