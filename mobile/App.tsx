import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState } from "react-native";
import { loadSavedApiUrl } from "./src/api/boot";

import HomeScreen from "./src/screens/HomeScreen";
import LearnStack from "./src/navigation/LearnStack";
import MarketScreen from "./src/screens/MarketScreen";
import NewsScreen from "./src/screens/NewsScreen";
import MoreStack from "./src/navigation/MoreStack";
import CatalogStack from "./src/navigation/CatalogStack";
import { colors } from "./src/theme/theme";

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

// Refetch when app comes back to foreground (RN equivalent of window focus).
AppState.addEventListener("change", (state) => {
  focusManager.setFocused(state === "active");
});

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: "⚡",
  Catalogs: "🗃️",
  Learn: "📚",
  Market: "📈",
  News: "📰",
  More: "⋯",
};

function TabIcon({ routeName, focused }: { routeName: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 20,
        opacity: focused ? 1 : 0.5,
        transform: [{ scale: focused ? 1.12 : 1 }],
      }}
    >
      {TAB_ICONS[routeName] ?? "•"}
    </Text>
  );
}

export default function App() {
  useEffect(() => {
    loadSavedApiUrl();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor: colors.tabActive,
              tabBarInactiveTintColor: colors.tabInactive,
              tabBarStyle: {
                backgroundColor: colors.bgElevated,
                borderTopColor: colors.border,
                height: 62,
                paddingBottom: 8,
                paddingTop: 6,
              },
              tabBarLabelStyle: { fontSize: 10.5, fontWeight: "700" },
              tabBarIcon: ({ focused }) => (
                <TabIcon routeName={route.name} focused={focused} />
              ),
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Catalogs" component={CatalogStack} />
            <Tab.Screen name="Learn" component={LearnStack} />
            <Tab.Screen name="Market" component={MarketScreen} />
            <Tab.Screen name="News" component={NewsScreen} />
            <Tab.Screen name="More" component={MoreStack} />
          </Tab.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
