"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getQuestionById } from "../../../lib/questions";

type Params = { params: { id: string } };

export default function Runner({ params }: Params) {
  const router = useRouter();
  const q = useMemo(() => getQuestionById(params.id), [params.id]);
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(q ? q.minutes * 60 : 0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [vi, setVi] = useState(false);

  useEffect(() => {
    if (!q) router.replace("/");
  }, [q, router]);

  // autosave
  useEffect(() => {
    const key = `draft:${params.id}`;
    const saved = localStorage.getItem(key);
    if (saved) setText(saved);
  }, [params.id]);
  useEffect(() => {
    const key = `draft:${params.id}`;
    localStorage.setItem(key, text);
  }, [params.id, text]);

  // timer
  useEffect(() => {
    if (!started || result) return;
    if (secondsLeft <= 0) {
      void handleSubmit();
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, secondsLeft, result]);

  if (!q) return null;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  async function handleSubmit() {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const r = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, answer: text, vietnamese: vi })
      });
      const data = await r.json();
      setResult(data);
    } catch (e) {
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="space-y-4">
      <div className="card space-y-2">
        <div className="text-xs uppercase opacity-70">
          {q.module} • Task {q.task}
        </div>
        <div className="font-semibold">{q.prompt}</div>
      </div>

      {!result && (
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm">⏱ {started ? `${mm}:${ss}` : `${q.minutes}:00`}</div>
            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={vi}
                onChange={(e) => setVi(e.target.checked)}
              />
              Vietnamese feedback
            </label>
          </div>
          <textarea
            className="input h-64"
            placeholder="Write your answer here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting || !!result}
          />
          <div className="flex gap-2">
            {!started ? (
              <button className="btn" onClick={() => setStarted(true)}>
                Start test
              </button>
            ) : (
              <>
                <button className="btn" disabled={submitting} onClick={handleSubmit}>
                  Submit
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setStarted(false);
                    setSecondsLeft(q.minutes * 60);
                  }}
                >
                  Pause
                </button>
              </>
            )}
          </div>
          <p className="text-xs opacity-70">
            Draft auto-saves locally and will auto-submit when the timer hits 0.
          </p>
        </div>
      )}

      {result && (
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold">Your score</h3>
          <div className="text-3xl font-bold">
            {result.overallBand?.toFixed ? result.overallBand.toFixed(1) : result.overallBand}
          </div>
          <ul className="grid grid-cols-1 gap-2">
            {result.criteria?.map((c: any, i: number) => (
              <li key={i} className="border rounded-xl p-3">
                <div className="font-medium">
                  {c.name} — Band {c.band?.toFixed ? c.band.toFixed(1) : c.band}
                </div>
                <p className="text-sm opacity-80 mt-1">{c.comment}</p>
              </li>
            ))}
          </ul>
          <div>
            <h4 className="font-medium mt-2">Examiner summary</h4>
            <p className="opacity-90 text-sm whitespace-pre-wrap">{result.summary}</p>
            {result.summaryVi && (
              <>
                <h4 className="font-medium mt-3">Tóm tắt (VI)</h4>
                <p className="opacity-90 text-sm whitespace-pre-wrap">{result.summaryVi}</p>
              </>
            )}
          </div>
          <button className="btn" onClick={() => (window.location.href = "/")}>
            Back to tasks
          </button>
        </div>
      )}
    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getQuestionById } from "../../../lib/questions";

type Params = { params: { id: string } };

export default function Runner({ params }: Params) {
  const router = useRouter();
  const q = useMemo(() => getQuestionById(params.id), [params.id]);
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(q ? q.minutes * 60 : 0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [vi, setVi] = useState(false);

  useEffect(() => {
    if (!q) router.replace("/");
  }, [q, router]);

  // autosave
  useEffect(() => {
    const key = `draft:${params.id}`;
    const saved = localStorage.getItem(key);
    if (saved) setText(saved);
  }, [params.id]);
  useEffect(() => {
    const key = `draft:${params.id}`;
    localStorage.setItem(key, text);
  }, [params.id, text]);

  // timer
  useEffect(() => {
    if (!started || result) return;
    if (secondsLeft <= 0) {
      void handleSubmit();
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, secondsLeft, result]);

  if (!q) return null;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  async function handleSubmit() {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const r = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, answer: text, vietnamese: vi })
      });
      const data = await r.json();
      setResult(data);
    } catch (e) {
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="space-y-4">
      <div className="card space-y-2">
        <div className="text-xs uppercase opacity-70">
          {q.module} • Task {q.task}
        </div>
        <div className="font-semibold">{q.prompt}</div>
      </div>

      {!result && (
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm">⏱ {started ? `${mm}:${ss}` : `${q.minutes}:00`}</div>
            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={vi}
                onChange={(e) => setVi(e.target.checked)}
              />
              Vietnamese feedback
            </label>
          </div>
          <textarea
            className="input h-64"
            placeholder="Write your answer here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting || !!result}
          />
          <div className="flex gap-2">
            {!started ? (
              <button className="btn" onClick={() => setStarted(true)}>
                Start test
              </button>
            ) : (
              <>
                <button className="btn" disabled={submitting} onClick={handleSubmit}>
                  Submit
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setStarted(false);
                    setSecondsLeft(q.minutes * 60);
                  }}
                >
                  Pause
                </button>
              </>
            )}
          </div>
          <p className="text-xs opacity-70">
            Draft auto-saves locally and will auto-submit when the timer hits 0.
          </p>
        </div>
      )}

      {result && (
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold">Your score</h3>
          <div className="text-3xl font-bold">
            {result.overallBand?.toFixed ? result.overallBand.toFixed(1) : result.overallBand}
          </div>
          <ul className="grid grid-cols-1 gap-2">
            {result.criteria?.map((c: any, i: number) => (
              <li key={i} className="border rounded-xl p-3">
                <div className="font-medium">
                  {c.name} — Band {c.band?.toFixed ? c.band.toFixed(1) : c.band}
                </div>
                <p className="text-sm opacity-80 mt-1">{c.comment}</p>
              </li>
            ))}
          </ul>
          <div>
            <h4 className="font-medium mt-2">Examiner summary</h4>
            <p className="opacity-90 text-sm whitespace-pre-wrap">{result.summary}</p>
            {result.summaryVi && (
              <>
                <h4 className="font-medium mt-3">Tóm tắt (VI)</h4>
                <p className="opacity-90 text-sm whitespace-pre-wrap">{result.summaryVi}</p>
              </>
            )}
          </div>
          <button className="btn" onClick={() => (window.location.href = "/")}>
            Back to tasks
          </button>
        </div>
      )}
    </main>
  );
}
