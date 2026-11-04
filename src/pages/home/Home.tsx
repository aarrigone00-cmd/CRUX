import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Leaf, Salad, Sparkles } from 'lucide-react';
import { useStore } from '@/data/store';
import { fuelReminders, recoverySuggestions } from '@/lib/suggestions';
import { SectionHeader } from '@/components/ui';
import { WeekChart } from '@/components/WeekChart';
import { Ridge } from '@/components/Ridge';
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
        <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-dashed border-clay-300 bg-bone-50/95 p-4 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-clay-800">New here? Load a week of sample data to see how CRUX looks in use. You can clear it any time in Profile & privacy.</p>
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
          <p className="mt-3 text-xs text-bone-100/55">Shows what you logged. Patterns here are observations, not causes.</p>
        </section>

        <section className="card-ink grain isolate" aria-label="CRUX GUIDE">
          <Ridge id="guide" climber={false} className="absolute inset-x-0 bottom-0 -z-10 h-40 w-full opacity-60" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-900 via-ink-900/85 to-ink-900/30" aria-hidden />
          <SectionHeader eyebrow="AI assistant" title="Get beta from GUIDE" icon={<Sparkles size={20} aria-hidden />} tone="mauve" />
          <p className="mb-4 text-bone-100/80">Warm-ups, meal ideas, recovery and planning help — in plain language.</p>
          <ul className="space-y-2">
            {GUIDE_PROMPTS.map((q) => (
              <li key={q}>
                <Link to={`/guide?q=${encodeURIComponent(q)}`} className="flex min-h-11 items-center justify-between gap-2 rounded-full border border-bone-50/15 bg-bone-50/[0.06] px-4 text-[0.95rem] font-medium text-bone-50 backdrop-blur transition-colors hover:bg-bone-50/15">
                  {q} <ArrowRight size={16} aria-hidden className="shrink-0 text-ochre-200" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
