import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../theme/theme";
import CatalogHubScreen from "../screens/CatalogHubScreen";
import CatalogListScreen from "../screens/CatalogListScreen";
import CatalogItemScreen from "../screens/CatalogItemScreen";

export type CatalogStackParams = {
  CatalogHome: undefined;
  CatalogList: { catalogKey: string; title?: string; icon?: string; desc?: string };
  CatalogItem: { catalogKey: string; idx?: number; id: string; title: string; item?: Record<string, unknown> };
};

const Stack = createNativeStackNavigator<CatalogStackParams>();

export default function CatalogStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="CatalogHome" component={CatalogHubScreen} options={{ title: "Catalogs" }} />
      <Stack.Screen name="CatalogList" component={CatalogListScreen} options={{ title: "Catalog" }} />
      <Stack.Screen name="CatalogItem" component={CatalogItemScreen} options={{ title: "Detail" }} />
    </Stack.Navigator>
  );
}
