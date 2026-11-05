import { useState } from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useStore } from '@/data/store';
import { defaultGrade, gradeLabel, gradeLabels } from '@/lib/grades';
import { DISCIPLINES, isBoulder, type Climb, type ClimbDiscipline, type ClimbOutcome } from '@/lib/types';
import { uid } from '@/lib/date';
import { SectionHeader, cx } from '@/components/ui';

const BOULDER_OUTCOMES: Array<{ id: ClimbOutcome; label: string }> = [
  { id: 'flash', label: 'Flash' },
  { id: 'redpoint', label: 'Send' },
  { id: 'project', label: 'Project' },
];
const ROUTE_OUTCOMES: Array<{ id: ClimbOutcome; label: string }> = [
  { id: 'onsight', label: 'Onsight' },
  { id: 'flash', label: 'Flash' },
  { id: 'redpoint', label: 'Redpoint' },
  { id: 'project', label: 'Project' },
];
export const outcomeLabel = (o: ClimbOutcome, boulder: boolean) => (boulder && o === 'redpoint' ? 'Send' : o.charAt(0).toUpperCase() + o.slice(1));

const DURATIONS = [45, 60, 90, 120, 180, 240];

function Seg<T extends string | number>({ value, options, onChange, label }: { value: T; options: Array<{ id: T; label: string }>; onChange: (v: T) => void; label: string }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-2">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={String(o.id)}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className={cx('min-h-10 border px-3.5 font-poster text-sm tracking-[0.08em] uppercase', value === o.id ? 'border-ink-900 bg-ink-900 text-mustard-300' : 'border-ink-900/25 hover:border-ink-900')}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Log a climbing session and the climbs in it. */
export function LogSession({ onDone }: { onDone: () => void }) {
  const { today, data, saveClimbSession } = useStore();
  const { boulderScale, routeScale } = data.profile;
  const [date, setDate] = useState(today);
  const [discipline, setDiscipline] = useState<ClimbDiscipline>('boulder');
  const [setting, setSetting] = useState<'indoor' | 'outdoor'>('indoor');
  const [location, setLocation] = useState(data.climbSessions.at(-1)?.location ?? '');
  const [duration, setDuration] = useState<number>(90);
  const [notes, setNotes] = useState('');
  const [climbs, setClimbs] = useState<Climb[]>([]);

  const boulder = isBoulder(discipline);
  const kind = boulder ? 'boulder' : 'route';
  const labels = gradeLabels(kind, boulderScale, routeScale);
  const outcomes = boulder ? BOULDER_OUTCOMES : ROUTE_OUTCOMES;

  // climb being added
  const [grade, setGrade] = useState(defaultGrade('boulder'));
  const [outcome, setOutcome] = useState<ClimbOutcome>('flash');
  const [attempts, setAttempts] = useState(1);
  const [name, setName] = useState('');

  function changeDiscipline(d: ClimbDiscipline) {
    if (isBoulder(d) !== boulder) {
      setClimbs([]);
      setGrade(defaultGrade(isBoulder(d) ? 'boulder' : 'route'));
      setOutcome(isBoulder(d) ? 'flash' : 'onsight');
    }
    setDiscipline(d);
  }

  function addClimb() {
    setClimbs((c) => [...c, { id: uid(), name: name.trim(), gradeIndex: grade, attempts: outcome === 'flash' || outcome === 'onsight' ? 1 : attempts, outcome, notes: '' }]);
    setName('');
    setAttempts(1);
  }

  return (
    <section className="card" aria-label="Log a climbing session">
      <SectionHeader
        eyebrow="New entry"
        title="Log a session"
        action={
          <button className="btn-ghost min-h-10" onClick={onDone} aria-label="Close">
            <X size={18} aria-hidden />
          </button>
        }
      />
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          saveClimbSession({ date, discipline, setting, location: location.trim(), durationMin: duration, notes: notes.trim(), climbs });
          onDone();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="eyebrow">Date</span>
            <input type="date" className="input mt-1" value={date} max={today} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <label className="block">
            <span className="eyebrow">Where</span>
            <input className="input mt-1" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Gym or crag" maxLength={80} />
          </label>
        </div>
        <Seg label="Discipline" value={discipline} onChange={changeDiscipline} options={DISCIPLINES} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Seg label="Setting" value={setting} onChange={setSetting} options={[{ id: 'indoor', label: 'Indoor' }, { id: 'outdoor', label: 'Outdoor' }]} />
          <Seg label="Duration (min)" value={duration} onChange={setDuration} options={DURATIONS.map((d) => ({ id: d, label: String(d) }))} />
        </div>

        {/* Climbs */}
        <div className="border border-ink-900/15 p-4">
          <p className="eyebrow mb-3">Climbs · {boulder ? `${boulderScale === 'V' ? 'V-scale' : 'Font'}` : routeScale}</p>
          {climbs.length > 0 && (
            <ol className="mb-4 divide-y divide-ink-900/10 border-y border-ink-900/10">
              {climbs.map((c, i) => (
                <li key={c.id} className="flex items-center gap-3 py-2">
                  <span className="font-mono text-xs text-ink-500">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-poster text-xl">{gradeLabel(kind, c.gradeIndex, boulderScale, routeScale)}</span>
                  <span className="text-sm">{outcomeLabel(c.outcome, boulder)}{c.outcome === 'redpoint' || c.outcome === 'project' ? ` · ${c.attempts} ${c.attempts === 1 ? 'try' : 'tries'}` : ''}</span>
                  <span className="flex-1 truncate text-sm text-ink-500">{c.name}</span>
                  <button type="button" aria-label={`Remove climb ${i + 1}`} onClick={() => setClimbs((xs) => xs.filter((x) => x.id !== c.id))} className="grid h-9 w-9 place-items-center text-ink-400 hover:text-ink-900">
                    <Trash2 size={15} aria-hidden />
                  </button>
                </li>
              ))}
            </ol>
          )}

          <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
            <div>
              <label htmlFor="climb-grade" className="eyebrow block">Grade</label>
              <select id="climb-grade" className="input mt-1 w-32 font-poster text-lg" value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
                {labels.map((l, i) => (
                  <option key={l + i} value={i}>{l}</option>
                ))}
              </select>
            </div>
            <label className="block">
              <span className="eyebrow">Name (optional)</span>
              <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Blue overhang" maxLength={80} />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <Seg label="Result" value={outcome} onChange={setOutcome} options={outcomes} />
            {(outcome === 'redpoint' || outcome === 'project') && (
              <div>
                <p className="eyebrow mb-2">Attempts</p>
                <div className="flex items-center gap-2">
                  <button type="button" className="btn-secondary h-10 w-10 px-0" aria-label="Fewer attempts" onClick={() => setAttempts((a) => Math.max(1, a - 1))}>
                    <Minus size={16} aria-hidden />
                  </button>
                  <output className="w-8 text-center font-poster text-xl" aria-live="polite">{attempts}</output>
                  <button type="button" className="btn-secondary h-10 w-10 px-0" aria-label="More attempts" onClick={() => setAttempts((a) => Math.min(999, a + 1))}>
                    <Plus size={16} aria-hidden />
                  </button>
                </div>
              </div>
            )}
          </div>
          <button type="button" className="btn-secondary mt-4" onClick={addClimb}>
            <Plus size={16} aria-hidden /> Add climb
          </button>
        </div>

        <label className="block">
          <span className="eyebrow">Session notes</span>
          <textarea className="input mt-1 min-h-24 border p-3" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} placeholder="How it felt, beta, conditions…" />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary">Save session{climbs.length ? ` · ${climbs.length} climb${climbs.length > 1 ? 's' : ''}` : ''}</button>
          <button type="button" className="btn-ghost" onClick={onDone}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
