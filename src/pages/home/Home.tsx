import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Leaf, Salad, Sparkles } from 'lucide-react';
import { useStore } from '@/data/store';
import { fuelReminders, recoverySuggestions } from '@/lib/suggestions';
import { SectionHeader } from '@/components/ui';
import { WeekChart } from '@/components/WeekChart';
import { CheckInCard } from './CheckInCard';
import { PrioritiesCard } from './PrioritiesCard';
import { WorkoutsCard } from './WorkoutsCard';
import { Hero } from './Hero';
import { QuickTiles } from './QuickTiles';
import { SuggestionCard } from './SuggestionCard';

const GUIDE_PROMPTS = ['A 15-minute bouldering warm-up', 'Finger-friendly stretches after crimping', 'Easy pre-climb snack ideas'];

export function Home() {
  const { data, today, todayCheckIn, loadDemo } = useStore();
  const todaysWorkouts = data.workouts.filter((w) => w.date === today);
  const isEmpty = !Object.keys(data.checkIns).length && !data.workouts.length && !data.priorities.length;

  return (
    <div className="rise space-y-5">
      <Hero />
      <QuickTiles />

      {isEmpty && (
        <div className="flex flex-col gap-3 bg-mustard-300 p-5 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg leading-snug text-ink-900 italic">New here? Load a week of sample data to see how CRUX looks in use. You can clear it any time in Profile & privacy.</p>
          <button className="btn-primary shrink-0" onClick={loadDemo}>
            Load demo data
          </button>
        </div>
      )}

      <CheckInCard key={todayCheckIn?.updatedAt ?? 'new'} />

      <div className="rise grid items-start gap-5 lg:grid-cols-2">
        <PrioritiesCard />
        <WorkoutsCard />
        <SuggestionCard
          eyebrow="Recovery beta"
          title="Listen to your body"
          icon={<Leaf size={20} aria-hidden />}
          tone="mauve"
          items={recoverySuggestions(todayCheckIn, data.workouts, today)}
          footnote="General wellness guidance based on what you logged today — not medical advice."
        />
        <SuggestionCard
          eyebrow="Fuel for the send"
          title="Nutrition reminders"
          icon={<Salad size={20} aria-hidden />}
          tone="moss"
          items={fuelReminders(todaysWorkouts)}
          footnote="Personalised meals and verified nutrition data arrive with CRUX FUEL."
        />

        <section className="card-ink grain" aria-label="Your week">
          <SectionHeader eyebrow="Last 7 days" title="Your week on the wall" icon={<Activity size={20} aria-hidden />} tone="clay" />
          <WeekChart data={data} today={today} />
          <p className="mt-4 font-display text-sm text-bone-100/60 italic">Shows what you logged. Patterns here are observations, not causes.</p>
        </section>

        <section className="grain bg-sky-300 p-5 shadow-[var(--shadow-soft)] sm:p-7" aria-label="CRUX GUIDE">
          <div className="flex items-baseline justify-between border-b border-ink-900/25 pb-3">
            <p className="flex items-baseline gap-4">
              <span className="font-display text-2xl leading-none">Guide</span>
              <span className="font-mono text-xs text-ink-700">/AI · BETA</span>
            </p>
            <Sparkles size={16} aria-hidden className="text-ink-900" />
          </div>
          <h2 className="mt-5 font-display text-4xl leading-none italic">Ask for beta.</h2>
          <p className="mt-2 font-display text-lg text-ink-700 italic">Warm-ups, meals, recovery, planning — in plain language.</p>
          <ol className="mt-5 border-t border-ink-900/25">
            {GUIDE_PROMPTS.map((q, i) => (
              <li key={q} className="border-b border-ink-900/25">
                <Link to={`/guide?q=${encodeURIComponent(q)}`} className="group flex min-h-12 items-center gap-3 text-ink-900">
                  <span className="font-mono text-[0.65rem] text-ink-700">0{i + 1}</span>
                  <span className="flex-1 group-hover:underline">{q}</span>
                  <ArrowRight size={16} aria-hidden className="shrink-0 -rotate-45 transition-transform group-hover:rotate-0" />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
