import Link from "next/link";
import { loadQuestions } from "@/lib/questions";

export default async function Page() {
  const questions = await loadQuestions();
  return (
    <main className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Choose a task</h2>
        <ul className="space-y-2">
          {questions.map((q) => (
            <li key={q.id} className="border rounded-xl p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
              <Link href={`/test/${q.id}`} className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase opacity-70">{q.module} • Task {q.task}</div>
                    <div className="font-medium mt-1">{q.prompt}</div>
                  </div>
                  <div className="text-sm opacity-70 shrink-0">⏱ {q.minutes} min</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
