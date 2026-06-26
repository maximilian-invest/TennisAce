import { TabPlaceholder } from '@/components/TabPlaceholder';
import { useLang } from '@/store/appStore';

export default function PlanTab() {
  const de = useLang() === 'de';
  return (
    <TabPlaceholder
      title="Plan"
      note={de ? 'Wochenplan & Periodisierung – kommt in Phase 3.' : 'Weekly plan & periodisation – coming in phase 3.'}
    />
  );
}
