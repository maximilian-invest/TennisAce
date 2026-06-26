import { Redirect } from 'expo-router';

import { useAppStore } from '@/store/appStore';

/** Entry point: route to onboarding or the main app based on persisted state. */
export default function Index() {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  return <Redirect href={hasOnboarded ? '/home' : '/onboarding/welcome'} />;
}
