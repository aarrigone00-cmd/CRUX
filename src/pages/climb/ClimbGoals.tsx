import { useState } from 'react';
import { Check, Plus, Target, Trash2 } from 'lucide-react';
import { useStore } from '@/data/store';
import { defaultGrade, gradeLabel, gradeLabels, type GradeKind } from '@/lib/grades';
import { goalMet, type Send } from '@/lib/climbStats';
import { fromISO } from '@/lib/date';
import { SectionHeader, cx } from '@/components/ui';

export function ClimbGoals({ sends }: { sends: Send[] }) {
  const { data, addGoal, toggleGoal, deleteGoal } = useStore();
  const { boulderScale, routeScale } = data.profile;
  const [adding, setAdding] = useState(false);
  const [kind, setKind] = useState<GradeKind>('boulder');
  const [target, setTarget] = useState(defaultGrade('boulder') + 1);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  return (
    <section className="card" aria-label="Climbing goals">
      <SectionHeader
        eyebrow="Personal"
        title="Climbing goals"
        action={
          !adding && (
            <button className="btn-ghost min-h-10" onClick={() => setAdding(true)}>
              <Plus size={16} aria-hidden /> Goal
            </button>
          )
        }
      />
      {!data.climbGoals.length && !adding && <p className="text-ink-600">Set a grade to aim for — CRUX ticks it off when you log the send.</p>}
      <ul className="space-y-2">
        {data.climbGoals.map((g) => {
          const met = goalMet(g, sends);
          const done = g.done || !!met;
          const title = g.title || `Send ${gradeLabel(g.discipline, g.targetIndex, boulderScale, routeScale)}`;
          return (
            <li key={g.id} className={cx('flex items-center gap-3 border p-3', done ? 'border-poster-green bg-moss-50' : 'border-ink-900/15')}>
              <button
                onClick={() => toggleGoal(g.id)}
                aria-pressed={done}
                aria-label={`${done ? 'Mark not done' : 'Mark done'}: ${title}`}
                className={cx('grid h-10 w-10 shrink-0 place-items-center border-2', done ? 'border-poster-green bg-poster-green text-white' : 'border-ink-300 text-ink-400')}
              >
                {done ? <Check size={18} strokeWidth={3} aria-hidden /> : <Target size={18} aria-hidden />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-ink-500">
                  Target {gradeLabel(g.discipline, g.targetIndex, boulderScale, routeScale)} {g.discipline === 'boulder' ? 'boulder' : 'route'}
                  {g.targetDate && ` · by ${fromISO(g.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                  {met && ` · sent ${fromISO(met.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 🎉`}
                </p>
              </div>
              <button onClick={() => deleteGoal(g.id)} aria-label={`Delete goal ${title}`} className="grid h-9 w-9 place-items-center text-ink-400 hover:text-ink-900">
                <Trash2 size={15} aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>

      {adding && (
        <form
          className="mt-3 space-y-4 border border-ink-900/15 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            addGoal({ title: title.trim(), discipline: kind, targetIndex: target, targetDate: date || null });
            setAdding(false);
            setTitle('');
            setDate('');
          }}
        >
          <div className="flex gap-1.5">
            {(['boulder', 'route'] as GradeKind[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => {
                  setKind(k);
                  setTarget(defaultGrade(k) + 1);
                }}
                className={cx('min-h-10 border px-3.5 font-poster text-sm tracking-[0.08em] uppercase', kind === k ? 'border-ink-900 bg-ink-900 text-mustard-300' : 'border-ink-900/25')}
              >
                {k === 'boulder' ? 'Boulder' : 'Route'}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto]">
            <div>
              <label htmlFor="goal-grade" className="eyebrow block">Target grade</label>
              <select id="goal-grade" className="input mt-1 w-32 font-poster text-lg" value={target} onChange={(e) => setTarget(Number(e.target.value))}>
                {gradeLabels(kind, boulderScale, routeScale).map((l, i) => (
                  <option key={l + i} value={i}>{l}</option>
                ))}
              </select>
            </div>
            <label className="block">
              <span className="eyebrow">Goal (optional)</span>
              <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. First outdoor V5" maxLength={80} />
            </label>
            <label className="block">
              <span className="eyebrow">By (optional)</span>
              <input type="date" className="input mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary">Add goal</button>
            <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}
