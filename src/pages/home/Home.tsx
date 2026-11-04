import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Leaf, Salad, Sparkles } from 'lucide-react';
import { useStore } from '@/data/store';
import { formatLongDate, greeting } from '@/lib/date';
import { fuelReminders, recoverySuggestions } from '@/lib/suggestions';
import { SectionHeader } from '@/components/ui';
import { WeekChart } from '@/components/WeekChart';
import { CheckInCard } from './CheckInCard';
import { PrioritiesCard } from './PrioritiesCard';
import { WorkoutsCard } from './WorkoutsCard';
import { SuggestionCard } from './SuggestionCard';

const GUIDE_PROMPTS = ['A 15-minute bouldering warm-up', 'Easy pre-climb snack ideas', 'Help me plan a calm evening routine'];

export function Home() {
  const { data, today, todayCheckIn, loadDemo } = useStore();
  const todaysWorkouts = data.workouts.filter((w) => w.date === today);
  const name = data.profile.displayName.trim();
  const isEmpty = !Object.keys(data.checkIns).length && !data.workouts.length && !data.priorities.length;

  return (
    <div className="space-y-5">
      <header className="pb-1">
        <p className="eyebrow">{formatLongDate()}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
          {greeting()}
          {name && `, ${name}`}
        </h1>
        <p className="mt-1 text-charcoal-600">
          {todayCheckIn ? 'Here’s your day at a glance.' : 'Start with a quick check-in — everything else adapts to it.'}
        </p>
      </header>

      {isEmpty && (
        <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-dashed border-lavender-300 bg-lavender-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-lavender-700">New here? Load a week of sample data to see how CRUX looks in use. You can clear it any time in Profile & privacy.</p>
          <button className="btn-secondary shrink-0 border-lavender-300 text-lavender-700 hover:bg-lavender-100" onClick={loadDemo}>
            Load demo data
          </button>
        </div>
      )}

      <CheckInCard key={todayCheckIn?.updatedAt ?? 'new'} />

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <PrioritiesCard />
        <WorkoutsCard />
        <SuggestionCard
          eyebrow="Recovery"
          title="Listen to your body"
          icon={<Leaf size={20} aria-hidden />}
          items={recoverySuggestions(todayCheckIn, data.workouts, today)}
          footnote="General wellness guidance based on what you logged today — not medical advice."
        />
        <SuggestionCard
          eyebrow="Fuel"
          title="Nutrition reminders"
          icon={<Salad size={20} aria-hidden />}
          items={fuelReminders(todaysWorkouts)}
          footnote="Personalised meals and verified nutrition data arrive with CRUX FUEL."
        />

        <section className="card" aria-label="Your week">
          <SectionHeader eyebrow="Last 7 days" title="Your week" icon={<Activity size={20} aria-hidden />} />
          <WeekChart data={data} today={today} />
          <p className="mt-3 text-xs text-charcoal-500">Shows what you logged. Patterns here are observations, not causes.</p>
        </section>

        <section className="card relative overflow-hidden border-lavender-200 bg-gradient-to-br from-lavender-50 to-rose-50" aria-label="CRUX GUIDE">
          <SectionHeader eyebrow="AI assistant" title="Ask CRUX GUIDE" icon={<Sparkles size={20} aria-hidden className="text-lavender-600" />} />
          <p className="mb-3 text-charcoal-600">Warm-ups, meal ideas, recovery and planning help — in plain language.</p>
          <ul className="space-y-2">
            {GUIDE_PROMPTS.map((q) => (
              <li key={q}>
                <Link to={`/guide?q=${encodeURIComponent(q)}`} className="flex min-h-11 items-center justify-between gap-2 rounded-xl bg-white/80 px-4 text-[0.95rem] font-medium text-charcoal-700 hover:bg-white">
                  {q} <ArrowRight size={16} aria-hidden className="shrink-0 text-lavender-500" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
