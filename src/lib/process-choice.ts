export type Lean = 'scrum' | 'kanban' | 'neutral';
export type Option = { label: string; leans: Lean; reason: string };
export type Question = { id: string; text: string; options: Option[] };
export type Pick = 'scrum' | 'kanban' | 'either';

export const QUESTIONS: Question[] = [
  {
    id: 'predictability',
    text: 'How predictable is the incoming work?',
    options: [
      { label: 'Mostly planned in advance', leans: 'scrum', reason: 'Planned work fits a fixed-length sprint commitment.' },
      { label: 'A mix of planned and urgent', leans: 'neutral', reason: 'A mix of planned and urgent work can work under either approach.' },
      { label: 'Mostly interrupts and requests', leans: 'kanban', reason: 'Interrupt-driven work flows better without sprint boundaries.' },
    ],
  },
  {
    id: 'capacity',
    text: 'How stable is the team\'s capacity?',
    options: [
      { label: 'Stable and dedicated to one product', leans: 'scrum', reason: 'Stable capacity makes a sprint forecast reliable.' },
      { label: 'It changes from sprint to sprint', leans: 'neutral', reason: 'Changing capacity weakens forecasts, so measure per person-day.' },
      { label: 'Shared across several products', leans: 'kanban', reason: 'A shared team has to balance several demands at once, which suits a continuous flow.' },
    ],
  },
  {
    id: 'priorities',
    text: 'How often do priorities change in the middle of a cycle?',
    options: [
      { label: 'Rarely', leans: 'scrum', reason: 'Stable priorities let a sprint protect its scope.' },
      { label: 'Sometimes', leans: 'neutral', reason: 'Occasional changes can be absorbed by either approach.' },
      { label: 'Most days', leans: 'kanban', reason: 'Frequent re-prioritising fights a fixed sprint scope.' },
    ],
  },
  {
    id: 'stakeholders',
    text: 'What do stakeholders need from the team?',
    options: [
      { label: 'A regular, committed delivery cadence', leans: 'scrum', reason: 'A fixed cadence gives stakeholders a predictable rhythm of delivery and review.' },
      { label: 'Either would do', leans: 'neutral', reason: 'If stakeholders are flexible, choose on the team\'s needs.' },
      { label: 'Quick response, delivered whenever it is ready', leans: 'kanban', reason: 'Releasing each item when it is ready gives the fastest response.' },
    ],
  },
  {
    id: 'size',
    text: 'How big are the work items?',
    options: [
      { label: 'Similar sizes that fit within a sprint', leans: 'scrum', reason: 'Similar-sized items make sprint planning straightforward.' },
      { label: 'A mix of sizes', leans: 'neutral', reason: 'A mix of sizes can be split or batched under either approach.' },
      { label: 'Widely varied, from tiny to huge', leans: 'kanban', reason: 'Wide variation makes sprint commitments hard; flow limits cope better.' },
    ],
  },
];

const TRADE_OFFS: Record<Pick, string> = {
  scrum:
    'Scrum gives you a regular rhythm, a committed scope and a clear review point. The cost is rigidity: urgent work has to wait for the next sprint or break the commitment.',
  kanban:
    'Kanban gives you flow, flexibility and fast response. The cost is less natural cadence and commitment, so add limits on work in progress and a regular review, or delivery can drift.',
  either:
    'The answers are balanced or missing, so either can work. Start with the lighter change: Kanban with a regular review, and add sprint cadence only if stakeholders need it.',
};

export function recommend(answers: Record<string, number>): { pick: Pick; scrum: number; kanban: number; reasons: string[]; tradeOff: string } {
  let scrum = 0;
  let kanban = 0;
  const reasons: string[] = [];
  for (const q of QUESTIONS) {
    const i = answers[q.id];
    if (!Number.isInteger(i) || i < 0 || i >= q.options.length) continue;
    const o = q.options[i];
    if (o.leans === 'scrum') scrum++;
    if (o.leans === 'kanban') kanban++;
    reasons.push(o.reason);
  }
  const pick: Pick = scrum > kanban ? 'scrum' : kanban > scrum ? 'kanban' : 'either';
  return { pick, scrum, kanban, reasons, tradeOff: TRADE_OFFS[pick] };
}
