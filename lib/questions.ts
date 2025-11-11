// lib/questions.ts
export type Question = {
  id: string;
  module: "Academic" | "General";
  task: 1 | 2;
  prompt: string;
  minutes: number;
};

export const questions: Question[] = [
  {
    id: "a1-graphs-transport-uk",
    module: "Academic",
    task: 1,
    prompt:
      "The charts show the percentage of journeys made by car, bus and train in the UK between 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minutes: 20
  },
  {
    id: "a2-tech-sociability",
    module: "Academic",
    task: 2,
    prompt:
      "Some people believe that modern technology is making people more sociable. To what extent do you agree or disagree?",
    minutes: 40
  },
  {
    id: "g1-letter-neighbour-noise",
    module: "General",
    task: 1,
    prompt:
      "You have recently moved into a new house. Write a letter to your neighbour about the noise from their late-night parties and suggest solutions.",
    minutes: 20
  },
  {
    id: "g2-work-remote-balance",
    module: "General",
    task: 2,
    prompt:
      "Many employees are choosing to work remotely. Discuss the advantages and disadvantages and give your own opinion.",
    minutes: 40
  }
];

export function getQuestionById(id: string) {
  return questions.find(q => q.id === id);
}
