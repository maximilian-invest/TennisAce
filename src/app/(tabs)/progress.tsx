import { TabPlaceholder } from '@/components/TabPlaceholder';
import { useLang } from '@/store/appStore';

export default function ProgressTab() {
  const de = useLang() === 'de';
  return (
    <TabPlaceholder
      title={de ? 'Fortschritt' : 'Progress'}
      note={de ? 'Radar, Verlaufskurven & Achievements – kommt in Phase 2/4.' : 'Radar, trends & achievements – coming in phase 2/4.'}
    />
  );
}
