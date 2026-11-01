import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../theme/theme";
import LearnHomeScreen from "../screens/LearnHomeScreen";
import ChapterDetailScreen from "../screens/ChapterDetailScreen";
import SearchChatScreen from "../screens/SearchChatScreen";
import CatalogListScreen from "../screens/CatalogListScreen";
import CatalogItemScreen from "../screens/CatalogItemScreen";

export type LearnStackParams = {
  LearnHome: undefined;
  ChapterDetail: { id: string; kind: "chapter" | "deep-dive" };
  SearchChat: undefined;
  CatalogList: { catalogKey: string; title?: string; icon?: string; desc?: string };
  CatalogItem: { catalogKey: string; idx?: number; id: string; title: string; item?: Record<string, unknown> };
};

const Stack = createNativeStackNavigator<LearnStackParams>();

export default function LearnStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen
        name="LearnHome"
        component={LearnHomeScreen}
        options={{ title: "Learn" }}
      />
      <Stack.Screen
        name="ChapterDetail"
        component={ChapterDetailScreen}
        options={({ route }) => ({ title: route.params.kind === "deep-dive" ? "Deep Dive" : "Chapter" })}
      />
      <Stack.Screen
        name="SearchChat"
        component={SearchChatScreen}
        options={{ title: "Search & AI Chat" }}
      />
      <Stack.Screen name="CatalogList" component={CatalogListScreen} options={{ title: "Catalog" }} />
      <Stack.Screen name="CatalogItem" component={CatalogItemScreen} options={{ title: "Detail" }} />
    </Stack.Navigator>
  );
}
