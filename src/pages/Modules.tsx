import { useState } from 'react';
import { Brain, CalendarHeart, Dumbbell, Mountain, Salad, StretchHorizontal } from 'lucide-react';
import { ModulePreview } from '@/components/ModulePreview';
import { cx } from '@/components/ui';

export function Cycle() {
  return (
    <ModulePreview
      name="CYCLE"
      accent="clay"
      icon={<CalendarHeart size={24} aria-hidden />}
      tagline="Menstrual health tracking that puts your own experience first."
      features={[
        'Period calendar',
        'Symptom logging',
        'Mood and energy alongside your cycle',
        'Optional contraception-aware tracking',
        'Historical trends',
        'Evidence-based educational articles',
      ]}
      principle="CRUX never assumes your cycle phase dictates how you will perform, and never estimates hormone levels from dates. Training suggestions come from how you say you feel today."
    />
  );
}

export function Mind() {
  return (
    <ModulePreview
      name="MIND"
      accent="mauve"
      icon={<Brain size={24} aria-hidden />}
      tagline="ADHD-friendly focus, mood and organisation — fewer decisions, more done."
      features={['Daily focus tracking', 'Mood, stress and sleep logs', 'Daily task planner', 'Simple, repeatable routines', 'Gentle reminders', 'Progress visualisation']}
      principle="Small steps, visible progress, no guilt. Your Home check-in and top-three priorities are the first pieces of MIND, and they already work."
    />
  );
}

export function Fuel() {
  return (
    <ModulePreview
      name="FUEL"
      icon={<Salad size={24} aria-hidden />}
      tagline="Simple, adequate fuelling for training and recovery."
      features={[
        'Personalised meal suggestions',
        'Pre- and post-workout meals',
        'Recipe recommendations',
        'Ingredient-based meal planning',
        'Grocery lists',
        'Dietary preferences',
        'ADHD-friendly low-prep meals',
        'Fuelling and recovery guidance',
      ]}
      principle="Nutrition values will come from verified food databases (such as USDA FoodData Central), never from guesses. Where data isn’t available, we’ll say so."
    />
  );
}

const TRAIN_TABS = [
  {
    id: 'move',
    label: 'Move',
    icon: <Dumbbell size={24} aria-hidden />,
    tagline: 'Log every kind of training in one place.',
    features: ['Climbing, strength, Pilates, yoga, running, cycling and more', 'Workout history', 'Duration and intensity', 'Session notes', 'Personal goals', 'Consistency charts'],
    principle: 'Planning a session from Home already works; MOVE adds full history and goals.',
  },
  {
    id: 'climb',
    label: 'Climb',
    icon: <Mountain size={24} aria-hidden />,
    tagline: 'A climbing log built by climbers.',
    features: ['Bouldering and route logs', 'V-scale, Font, YDS and French grades', 'Attempts, flashes and sends', 'Session notes', 'Grade pyramid and progression', 'Personal climbing goals'],
  },
  {
    id: 'prep',
    label: 'Prep',
    icon: <StretchHorizontal size={24} aria-hidden />,
    tagline: 'Warm-ups, mobility and recovery routines with guided timers.',
    features: ['Finger and wrist mobility', 'Shoulder preparation', 'Hip mobility', 'Progressive climbing warm-ups', 'Strength exercises and technique drills', 'Guided timers', 'Post-workout stretching', 'Injury-aware modifications'],
    principle: 'Any pain you report in your check-in will filter out exercises that load that area.',
  },
] as const;

export function Train() {
  const [tab, setTab] = useState<(typeof TRAIN_TABS)[number]['id']>('move');
  const t = TRAIN_TABS.find((x) => x.id === tab)!;
  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Train sections" className="grid grid-cols-3 gap-1 rounded-full bg-ink-900 p-1.5">
        {TRAIN_TABS.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={tab === x.id}
            onClick={() => setTab(x.id)}
            className={cx('min-h-11 rounded-full text-sm font-semibold transition-colors', tab === x.id ? 'bg-bone-50 text-ink-900 shadow-sm' : 'text-bone-100/70 hover:text-bone-50')}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        <ModulePreview key={t.id} art={t.id === 'climb' ? 'wall' : 'ridge'} name={t.label.toUpperCase()} icon={t.icon} tagline={t.tagline} features={[...t.features]} principle={'principle' in t ? t.principle : undefined} />
      </div>
    </div>
  );
}
