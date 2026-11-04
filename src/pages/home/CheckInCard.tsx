import { useState } from 'react';
import { Annoyed, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, CloudLightning, CloudRain, Cloud, CloudSun, Frown, HeartPulse, Laugh, Meh, Minus, Moon, Pencil, Plus, Smile, Sun, Zap } from 'lucide-react';
import { useStore } from '@/data/store';
import { PAIN_AREAS, type PainArea, type Scale } from '@/lib/types';
import { Chip, Pill, ScalePicker, SectionHeader } from '@/components/ui';

const MOOD = ['Very low', 'Low', 'Okay', 'Good', 'Great'] as [string, string, string, string, string];
const ENERGY = ['Drained', 'Low', 'Steady', 'Strong', 'Charged'] as [string, string, string, string, string];
const MOOD_ICONS = [Frown, Annoyed, Meh, Smile, Laugh];
const ENERGY_ICONS = [BatteryWarning, BatteryLow, BatteryMedium, BatteryFull, Zap];
const STRESS_ICONS = [Sun, CloudSun, Cloud, CloudRain, CloudLightning];
const STRESS = ['Calm', 'Mild', 'Moderate', 'High', 'Overwhelmed'] as [string, string, string, string, string];

export function CheckInCard() {
  const { todayCheckIn, saveCheckIn } = useStore();
  const [editing, setEditing] = useState(!todayCheckIn);
  const [mood, setMood] = useState<Scale | undefined>(todayCheckIn?.mood);
  const [energy, setEnergy] = useState<Scale | undefined>(todayCheckIn?.energy);
  const [stress, setStress] = useState<Scale | undefined>(todayCheckIn?.stress);
  const [sleep, setSleep] = useState<number>(todayCheckIn?.sleepHours ?? 7);
  const [pain, setPain] = useState<PainArea[]>(todayCheckIn?.pain ?? []);
  const [showPain, setShowPain] = useState((todayCheckIn?.pain.length ?? 0) > 0);

  const ready = mood && energy && stress;

  if (todayCheckIn && !editing) {
    const c = todayCheckIn;
    return (
      <section id="checkin" className="card scroll-mt-20" aria-label="Daily check-in">
        <SectionHeader
          eyebrow="Today’s check-in"
          title="Logged — thank you"
          icon={<HeartPulse size={20} aria-hidden />}
          tone="clay"
          action={
            <button className="btn-ghost min-h-10 text-sm" onClick={() => setEditing(true)}>
              <Pencil size={16} aria-hidden /> Edit
            </button>
          }
        />
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Mood" value={MOOD[c.mood - 1]} sub={`${c.mood}/5`} cls="bg-moss-50 border-moss-100" />
          <Stat label="Energy" value={ENERGY[c.energy - 1]} sub={`${c.energy}/5`} cls="bg-mauve-50 border-mauve-100" />
          <Stat label="Stress" value={STRESS[c.stress - 1]} sub={`${c.stress}/5`} cls="bg-clay-50 border-clay-100" />
          <Stat label="Sleep" value={`${c.sleepHours} h`} sub="last night" cls="bg-bone-200/70 border-bone-300" />
        </dl>
        {c.pain.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-600">Pain / soreness:</span>
            {c.pain.map((p) => (
              <Pill key={p} tone="clay">{p}</Pill>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section id="checkin" className="card scroll-mt-20" aria-label="Daily check-in">
      <SectionHeader eyebrow="Chalk up · 30 seconds" title="How are you today?" icon={<HeartPulse size={20} aria-hidden />}
          tone="clay" />
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) return;
          saveCheckIn({ mood, energy, stress, sleepHours: sleep, pain });
          setEditing(false);
        }}
      >
        <ScalePicker label="Mood" value={mood} onChange={setMood} labels={MOOD} icons={MOOD_ICONS} />
        <ScalePicker label="Energy" value={energy} onChange={setEnergy} labels={ENERGY} icons={ENERGY_ICONS} accent="mauve" />
        <ScalePicker label="Stress" value={stress} onChange={setStress} labels={STRESS} icons={STRESS_ICONS} accent="clay" />

        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-700" id="sleep-label">
            <Moon size={16} aria-hidden /> Sleep last night
          </p>
          <div className="flex items-center gap-3" role="group" aria-labelledby="sleep-label">
            <button type="button" className="btn-secondary h-12 w-12 px-0" aria-label="Less sleep" onClick={() => setSleep((s) => Math.max(0, s - 0.5))}>
              <Minus size={18} aria-hidden />
            </button>
            <output className="min-w-20 text-center font-display text-2xl font-semibold" aria-live="polite">
              {sleep} h
            </output>
            <button type="button" className="btn-secondary h-12 w-12 px-0" aria-label="More sleep" onClick={() => setSleep((s) => Math.min(14, s + 0.5))}>
              <Plus size={18} aria-hidden />
            </button>
          </div>
        </div>

        <div>
          {!showPain ? (
            <button type="button" className="text-sm font-semibold text-clay-600 underline-offset-4 hover:underline" onClick={() => setShowPain(true)}>
              + Anything hurting or unusually sore?
            </button>
          ) : (
            <fieldset>
              <legend className="mb-1 text-sm font-semibold text-ink-700">Pain or unusual soreness (optional)</legend>
              <p className="mb-3 text-sm text-ink-500">We’ll steer suggestions away from these areas.</p>
              <div className="flex flex-wrap gap-2">
                {PAIN_AREAS.map((a) => (
                  <Chip key={a} selected={pain.includes(a)} onClick={() => setPain((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]))}>
                    {a}
                  </Chip>
                ))}
              </div>
            </fieldset>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary flex-1 sm:flex-none" disabled={!ready}>
            Save check-in
          </button>
          {todayCheckIn && (
            <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>
              Cancel
            </button>
          )}
        </div>
        {!ready && <p className="text-sm text-ink-500">Pick mood, energy and stress to save.</p>}
      </form>
    </section>
  );
}

function Stat({ label, value, sub, cls }: { label: string; value: string; sub: string; cls: string }) {
  return (
    <div className={`rounded-2xl border p-3 ${cls}`}>
      <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink-800">{value}</dd>
      <dd className="text-xs text-ink-500">{sub}</dd>
    </div>
  );
}
