import { useState } from 'react';
import { Check, Clock, Dumbbell, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/data/store';
import { ACTIVITY_TYPES, type ActivityType, type Intensity } from '@/lib/types';
import { Pill, SectionHeader, cx } from '@/components/ui';

const DURATIONS = [15, 30, 45, 60, 90];
const INTENSITY: Intensity[] = ['easy', 'moderate', 'hard'];
const intensityTone = { easy: 'sage', moderate: 'lavender', hard: 'rose' } as const;

export function WorkoutsCard() {
  const { data, today, addWorkout, toggleWorkout, removeWorkout } = useStore();
  const items = data.workouts.filter((w) => w.date === today);
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState<ActivityType>(data.profile.focusActivities[0] ?? 'Bouldering');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(60);
  const [intensity, setIntensity] = useState<Intensity>('moderate');

  return (
    <section className="card" aria-label="Planned workouts">
      <SectionHeader
        eyebrow="Planned"
        title="Today’s training"
        icon={<Dumbbell size={20} aria-hidden />}
        action={
          !adding && (
            <button className="btn-ghost min-h-10 text-sm" onClick={() => setAdding(true)}>
              <Plus size={16} aria-hidden /> Plan
            </button>
          )
        }
      />

      {items.length === 0 && !adding && <p className="text-charcoal-600">Nothing planned. Rest is training too — or tap <strong>Plan</strong> to add a session.</p>}

      <ul className="space-y-2">
        {items.map((w) => (
          <li key={w.id} className={cx('flex items-center gap-3 rounded-2xl border p-3', w.completed ? 'border-sage-200 bg-sage-50' : 'border-cream-300 bg-white')}>
            <button
              onClick={() => toggleWorkout(w.id)}
              aria-pressed={w.completed}
              aria-label={`${w.completed ? 'Mark not done' : 'Mark done'}: ${w.title || w.type}`}
              className={cx(
                'grid h-10 w-10 shrink-0 place-items-center rounded-full border-2',
                w.completed ? 'border-sage-600 bg-sage-600 text-white' : 'border-sage-300 text-transparent hover:border-sage-500',
              )}
            >
              <Check size={18} strokeWidth={3} aria-hidden />
            </button>
            <div className="min-w-0 flex-1">
              <p className={cx('truncate font-semibold', w.completed && 'text-charcoal-500')}>{w.title || w.type}</p>
              <p className="flex flex-wrap items-center gap-2 text-sm text-charcoal-500">
                <span>{w.type}</span>
                <span className="flex items-center gap-1"><Clock size={13} aria-hidden /> {w.durationMin} min</span>
                <Pill tone={intensityTone[w.intensity]}>{w.intensity}</Pill>
              </p>
            </div>
            <button onClick={() => removeWorkout(w.id)} aria-label={`Delete ${w.title || w.type}`} className="grid h-9 w-9 place-items-center rounded-full text-charcoal-400 hover:bg-cream-200 hover:text-charcoal-700">
              <Trash2 size={16} aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      {adding && (
        <form
          className="mt-3 space-y-4 rounded-2xl bg-cream-200/50 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            addWorkout({ date: today, type, title: title.trim(), durationMin: duration, intensity });
            setTitle('');
            setAdding(false);
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-charcoal-700">
              Activity
              <select className="input mt-1" value={type} onChange={(e) => setType(e.target.value as ActivityType)}>
                {ACTIVITY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-charcoal-700">
              Name <span className="font-normal text-charcoal-500">(optional)</span>
              <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Overhang projecting" maxLength={60} />
            </label>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-charcoal-700">Duration</legend>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button key={d} type="button" aria-pressed={duration === d} onClick={() => setDuration(d)}
                  className={cx('min-h-10 rounded-full border px-4 text-sm font-semibold', duration === d ? 'border-sage-700 bg-sage-700 text-white' : 'border-cream-300 bg-white text-charcoal-600')}>
                  {d} min
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-charcoal-700">Intensity</legend>
            <div className="grid grid-cols-3 gap-2">
              {INTENSITY.map((i) => (
                <button key={i} type="button" aria-pressed={intensity === i} onClick={() => setIntensity(i)}
                  className={cx('min-h-11 rounded-xl border text-sm font-semibold capitalize', intensity === i ? 'border-sage-700 bg-sage-700 text-white' : 'border-cream-300 bg-white text-charcoal-600')}>
                  {i}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex gap-2">
            <button className="btn-primary flex-1 sm:flex-none">Add to today</button>
            <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}
