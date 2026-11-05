import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '@/data/store';
import { gradeLabel, type GradeKind } from '@/lib/grades';
import { allSends, hardest, sendRate, sessionsThisMonth } from '@/lib/climbStats';
import { PHOTOS } from '@/lib/photos';
import { ArchiveHeader } from '@/components/ModulePreview';
import { SectionHeader, cx } from '@/components/ui';
import { LogSession } from './LogSession';
import { Progression, Pyramid } from './ClimbCharts';
import { ClimbGoals } from './ClimbGoals';
import { ClimbHistory } from './ClimbHistory';

function Toggle<T extends string>({ value, options, onChange, label }: { value: T; options: Array<{ id: T; label: string }>; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex border border-ink-900">
      {options.map((o) => (
        <button
          key={o.id}
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cx('min-h-9 px-3 font-poster text-xs tracking-[0.1em] uppercase', value === o.id ? 'bg-ink-900 text-mustard-300' : 'text-ink-700 hover:bg-bone-200')}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ClimbPage() {
  const { data, updateProfile } = useStore();
  const profile = data.profile;
  const [logging, setLogging] = useState(false);
  const [kind, setKind] = useState<GradeKind>('boulder');
  const sends = useMemo(() => allSends(data.climbSessions), [data.climbSessions]);

  const hb = hardest(sends, 'boulder');
  const hr = hardest(sends, 'route');
  const rate = sendRate(data.climbSessions);
  const g = (k: GradeKind, v: number | null) => (v === null ? '—' : gradeLabel(k, v, profile.boulderScale, profile.routeScale));

  return (
    <div className="rise space-y-5">
      <ArchiveHeader
        name="Climb"
        vol="002"
        block="cobalt"
        status="Live · Your log"
        tagline="Boulders, routes, attempts and sends — your climbing, on the record."
        plates={['holds', 'ridge-calm', 'wall']}
        captions={['Hanging traverse, c. 1965', 'Smith Rock, 1987', 'Smith Rock, 1989']}
        photos={[PHOTOS.traverse65, PHOTOS.smith87c, PHOTOS.smith89b]}
      />

      {/* Index numbers */}
      <section className="card" aria-label="Climbing summary">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink-900/15 pb-3">
          <div>
            <p className="eyebrow">At a glance</p>
            <h2 className="mt-1 text-[1.7rem] leading-none">Your numbers</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Toggle label="Boulder grades" value={profile.boulderScale} onChange={(v) => updateProfile({ boulderScale: v })} options={[{ id: 'V', label: 'V-scale' }, { id: 'Font', label: 'Font' }]} />
            <Toggle label="Route grades" value={profile.routeScale} onChange={(v) => updateProfile({ routeScale: v })} options={[{ id: 'YDS', label: 'YDS' }, { id: 'French', label: 'French' }]} />
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Hardest boulder" value={g('boulder', hb)} sub={`last 30 days: ${g('boulder', hardest(sends, 'boulder', 30))}`} />
          <Stat label="Hardest route" value={g('route', hr)} sub={`last 30 days: ${g('route', hardest(sends, 'route', 30))}`} />
          <Stat label="Sessions" value={String(sessionsThisMonth(data.climbSessions))} sub="this month" />
          <Stat label="Send rate" value={rate === null ? '—' : `${rate}%`} sub="climbs sent, 30 days" />
        </dl>
        <p className="mt-3 text-sm text-ink-500">Grade conversions between systems are approximate.</p>
      </section>

      {logging ? (
        <LogSession onDone={() => setLogging(false)} />
      ) : (
        <button className="btn-primary w-full sm:w-auto" onClick={() => setLogging(true)}>
          <Plus size={16} aria-hidden /> Log a climbing session
        </button>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section className="card" aria-label="Grade pyramid">
          <SectionHeader
            eyebrow="Last 90 days"
            title="Grade pyramid"
            action={<Toggle label="Pyramid discipline" value={kind} onChange={setKind} options={[{ id: 'boulder', label: 'Boulder' }, { id: 'route', label: 'Route' }]} />}
          />
          <Pyramid sends={sends} kind={kind} profile={profile} />
        </section>
        <section className="card" aria-label="Progression">
          <SectionHeader eyebrow="Six months" title="Hardest send" />
          <Progression sends={sends} kind={kind} profile={profile} />
        </section>
      </div>

      <ClimbGoals sends={sends} />
      <ClimbHistory />
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="border-l-4 border-poster-red pl-3">
      <dt className="eyebrow">{label}</dt>
      <dd className="font-poster text-4xl leading-tight">{value}</dd>
      <dd className="text-sm text-ink-500">{sub}</dd>
    </div>
  );
}
