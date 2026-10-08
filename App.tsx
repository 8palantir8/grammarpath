import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, Pressable } from 'react-native';
import { useStore } from './src/store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { dueExerciseIds } from './src/domain/logic';
import { Home, PathScreen, ReviewScreen, LevelScreen, TopicScreen, SessionScreen, ProgressScreen } from './src/screens';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  componentDidCatch(e: unknown) { console.warn('UI error', e); } // plug a reporter (e.g. Sentry) in here
  render() {
    return this.state.err ? (<View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 18 }}>Something went wrong. Your progress is safe.</Text>
      <Pressable onPress={() => this.setState({ err: false })}><Text style={{ color: '#2f5bea' }}>Try again</Text></Pressable></View>) : this.props.children;
  }
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const icon = (e: string) => ({ tabBarIcon: () => <Text style={{ fontSize: 20 }}>{e}</Text> });

function Tabs() {
  const due = useStore((x) => dueExerciseIds(x.data).length);
  return (<Tab.Navigator>
    <Tab.Screen name="Home" component={Home} options={{ title: 'GrammarPath', tabBarLabel: 'Home', ...icon('🏠') }} />
    <Tab.Screen name="Path" component={PathScreen} options={{ title: 'Learning path', ...icon('🗺️') }} />
    <Tab.Screen name="Review" component={ReviewScreen} options={{ tabBarBadge: due || undefined, ...icon('🔁') }} />
    <Tab.Screen name="Stats" component={ProgressScreen} options={{ title: 'Progress', ...icon('📊') }} />
  </Tab.Navigator>);
}
export default function App() {
  const { init, ready } = useStore();
  useEffect(() => { init(); }, [init]);
  if (!ready) return <Text style={{ padding: 40 }}>Loading…</Text>;
  return (<ErrorBoundary><NavigationContainer><Stack.Navigator>
    <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
    <Stack.Screen name="Level" component={LevelScreen} />
    <Stack.Screen name="Topic" component={TopicScreen} />
    <Stack.Screen name="Session" component={SessionScreen} />
  </Stack.Navigator></NavigationContainer></ErrorBoundary>);
}
