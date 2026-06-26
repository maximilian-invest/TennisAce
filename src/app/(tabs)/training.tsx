import { TabPlaceholder } from '@/components/TabPlaceholder';
import { useLang } from '@/store/appStore';

export default function TrainingTab() {
  const de = useLang() === 'de';
  return (
    <TabPlaceholder
      title={de ? 'Training' : 'Train'}
      note={de ? 'Workout-Player – kommt in Phase 3.' : 'Workout player – coming in phase 3.'}
    />
  );
}
