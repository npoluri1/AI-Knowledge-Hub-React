import React, { useMemo } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CatalogHubScreen from "../screens/CatalogHubScreen";
import VideoHubScreen from "../screens/VideoHubScreen";
import LinkedInPostsScreen from "../screens/LinkedInPostsScreen";
import FilesGalleryScreen from "../screens/FilesGalleryScreen";
import ImageViewerScreen from "../screens/ImageViewerScreen";
import SettingsScreen from "../screens/SettingsScreen";
import JobsScreen from "../screens/JobsScreen";
import TradingScreen from "../screens/TradingScreen";
import AdvisorScreen from "../screens/AdvisorScreen";
import NewsScreen from "../screens/NewsScreen";
import CatalogListScreen from "../screens/CatalogListScreen";
import CatalogItemScreen from "../screens/CatalogItemScreen";
import EdurekaDocsScreen from "../screens/EdurekaDocsScreen";
import { ProjectsListScreen, ProjectDetailScreen } from "../screens/ProjectsScreen";
import { colors, baseStyles, spacing, type, radius, shadow } from "../theme/theme";
import { LargeTitle, TileCard, SectionLabel } from "../components/ui";
import { WEB_MENU } from "./webMenu";

export type MoreStackParams = {
  MoreHome: undefined;
  WebMenu: undefined;
  WebOnly: undefined;
  CatalogHub: undefined;
  CatalogList: { catalogKey: string; title?: string; icon?: string; desc?: string };
  CatalogItem: { catalogKey: string; idx?: number; id: string; title: string; item?: Record<string, unknown> };
  EdurekaDocs: undefined;
  EdurekaDoc: { docId: string };
  ProjectsList: undefined;
  ProjectDetail: { path: string; title: string };
  VideoHub: undefined;
  LinkedInPosts: undefined;
  FilesGallery: undefined;
  ImageViewer: { url: string; title?: string };
  Jobs: undefined;
  Trading: undefined;
  Advisor: undefined;
  News: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<MoreStackParams>();

// ── Exact-web-menu section inside More ──────────────────────────────────────

function WebMenuSection({ navigation }: any) {
  const rows = useMemo(
    () =>
      WEB_MENU.filter((m) => m.dest.kind !== "screen" || !["home"].includes(m.dest.screen)).map((m, i) => ({
        ...m,
        id: `${m.label}-${i}`,
      })),
    []
  );

  const open = (m: (typeof rows)[number]) => {
    const d = m.dest as any;
    if (d.kind === "catalog") {
      navigation.navigate("CatalogList", { catalogKey: d.key, title: m.label, icon: m.icon });
    } else if (d.kind === "screen") {
      const map: Record<string, string> = {
        files: "FilesGallery",
        news: "News",
        jobs: "Jobs",
        edureka: "EdurekaDocs",
        projects: "ProjectsList",
        linkedin: "LinkedInPosts",
        videohub: "VideoHub",
        trading: "Trading",
      };
      const screen = map[d.screen];
      if (screen) navigation.navigate(screen);
      else if (d.screen === "home") navigation.popToTop();
    } else if (d.kind === "web-only") {
      navigation.navigate("WebOnly");
    }
  };

  return (
    <FlatList
      data={rows}
      keyExtractor={(r) => r.id}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
      style={{ backgroundColor: colors.bg }}
      ListHeaderComponent={
        <LargeTitle
          title="All Web Menus"
          subtitle={`${WEB_MENU.length} sections — the exact menu from the web app, same order, same counts`}
        />
      }
      renderItem={({ item: m }) => (
        <TileCard
          icon={m.icon}
          title={m.label}
          badge={m.count}
          desc={m.dest.kind === "web-only" ? "Custom web visualization — content available via catalogs" : undefined}
          onPress={() => open(m)}
        />
      )}
    />
  );
}

// ── Web-only placeholder ────────────────────────────────────────────────────

function WebOnlyScreen({ navigation }: any) {
  React.useEffect(() => {
    navigation?.setOptions?.({ title: "Web-only visualization" });
  }, []);
  const { View: V, Text: T } = require("react-native");
  return (
    <V style={[baseStyles.center, { backgroundColor: colors.bg }]}>
      <T style={{ fontSize: 44, marginBottom: spacing.md }}>🖥️</T>
      <T style={{ color: colors.text, fontSize: type.title3.fontSize, fontWeight: "700", marginBottom: 6 }}>
        Custom web visualization
      </T>
      <T style={{ color: colors.textDim, fontSize: type.callout.fontSize, textAlign: "center", maxWidth: 300, lineHeight: 19 }}>
        This section is an interactive tool built specifically for the browser. All of its underlying data is
        available in the Catalogs tab — search for it there.
      </T>
    </V>
  );
}

// ── More home ────────────────────────────────────────────────────────────────

const GROUPS: { label: string; icon: string; desc: string; to: keyof MoreStackParams }[] = [
  { label: "All Web Menus", icon: "📋", desc: "The exact web sidebar — every section, 1:1", to: "WebMenu" },
  { label: "Catalog Hub", icon: "🗃️", desc: "All 35 datasets with search & filters", to: "CatalogHub" },
  { label: "AI News Dashboard", icon: "📰", desc: "200+ RSS & scraped sources", to: "News" },
  { label: "Video Hub", icon: "🎬", desc: "YouTube, TikTok, Instagram, Facebook & X", to: "VideoHub" },
  { label: "LinkedIn Posts", icon: "💼", desc: "Daily deterministic AI posts", to: "LinkedInPosts" },
  { label: "AI Jobs", icon: "🧑‍💻", desc: "2,000+ curated listings with filters", to: "Jobs" },
  { label: "Trading Desk", icon: "📊", desc: "Gainers, losers, movers & live picks", to: "Trading" },
  { label: "Financial Advisor", icon: "🤖", desc: "Deep stock analysis & market news", to: "Advisor" },
  { label: "Files & Gallery", icon: "📂", desc: "Images, PDFs, docs from the server", to: "FilesGallery" },
  { label: "Edureka AI Docs", icon: "📚", desc: "31 curated markdown reference docs", to: "EdurekaDocs" },
  { label: "All Projects", icon: "🗂️", desc: "200+ scanned local projects with READMEs", to: "ProjectsList" },
  { label: "Settings", icon: "⚙️", desc: "API server address & connection", to: "Settings" },
];

function MoreHome({ navigation }: any) {
  return (
    <FlatList
      data={GROUPS}
      keyExtractor={(g) => g.label}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
      style={{ backgroundColor: colors.bg }}
      ListHeaderComponent={<LargeTitle title="More" subtitle="Everything from the web app, in your pocket" />}
      renderItem={({ item: g }) => (
        <TileCard icon={g.icon} title={g.label} desc={g.desc} onPress={() => navigation.navigate(g.to)} />
      )}
    />
  );
}

export default function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="MoreHome" component={MoreHome} options={{ title: "More" }} />
      <Stack.Screen name="WebMenu" component={WebMenuSection} options={{ title: "All Web Menus" }} />
      <Stack.Screen name="WebOnly" component={WebOnlyScreen} options={{ title: "Web-only" }} />
      <Stack.Screen name="CatalogHub" component={CatalogHubScreen} options={{ title: "Catalogs" }} />
      <Stack.Screen name="CatalogList" component={CatalogListScreen} options={{ title: "Catalog" }} />
      <Stack.Screen name="CatalogItem" component={CatalogItemScreen} options={{ title: "Detail" }} />
      <Stack.Screen name="EdurekaDocs" component={EdurekaDocsScreen} options={{ title: "Edureka AI Docs" }} />
      <Stack.Screen name="EdurekaDoc" component={EdurekaDocsScreen} options={{ title: "Edureka Doc" }} />
      <Stack.Screen name="ProjectsList" component={ProjectsListScreen} options={{ title: "All Projects" }} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: "Project" }} />
      <Stack.Screen name="VideoHub" component={VideoHubScreen} options={{ title: "Video Hub" }} />
      <Stack.Screen name="LinkedInPosts" component={LinkedInPostsScreen} options={{ title: "LinkedIn Posts" }} />
      <Stack.Screen name="News" component={NewsScreen} options={{ title: "AI News" }} />
      <Stack.Screen name="Jobs" component={JobsScreen} options={{ title: "AI Jobs" }} />
      <Stack.Screen name="Trading" component={TradingScreen} options={{ title: "Trading Desk" }} />
      <Stack.Screen name="Advisor" component={AdvisorScreen} options={{ title: "Financial Advisor" }} />
      <Stack.Screen name="FilesGallery" component={FilesGalleryScreen} options={{ title: "Files & Gallery" }} />
      <Stack.Screen name="ImageViewer" component={ImageViewerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
    </Stack.Navigator>
  );
}
