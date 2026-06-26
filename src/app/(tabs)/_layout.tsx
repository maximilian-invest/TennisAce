import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { useLang } from '@/store/appStore';
import { useTheme } from '@/theme/ThemeContext';

function Dot({ color, focused }: { color: string; focused: boolean }) {
  return <View style={{ width: focused ? 18 : 8, height: 8, borderRadius: 4, backgroundColor: color }} />;
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const de = useLang() === 'de';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.dim,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
        tabBarLabelStyle: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 11 },
        tabBarIcon: ({ focused }) => <Dot color={focused ? colors.accent : colors.dim} focused={focused} />,
      }}
    >
      <Tabs.Screen name="home" options={{ title: de ? 'Start' : 'Home' }} />
      <Tabs.Screen name="plan" options={{ title: 'Plan' }} />
      <Tabs.Screen name="training" options={{ title: de ? 'Training' : 'Train' }} />
      <Tabs.Screen name="progress" options={{ title: de ? 'Fortschritt' : 'Progress' }} />
      <Tabs.Screen name="profile" options={{ title: de ? 'Profil' : 'Profile' }} />
    </Tabs>
  );
}
