import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { getChapters, getIndices, getCatalogs, getJobs } from "../api/api";
import { getApiBaseUrl } from "../api/client";
import { colors, baseStyles, spacing, type, radius, shadow } from "../theme/theme";
import { TileCard, SectionLabel } from "../components/ui";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();

  const chaptersQ = useQuery({ queryKey: ["chapters"], queryFn: getChapters, staleTime: 5 * 60_000 });
  const indicesQ = useQuery({
    queryKey: ["indices"],
    queryFn: getIndices,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });
  const catalogsQ = useQuery({ queryKey: ["catalogs"], queryFn: getCatalogs, staleTime: 5 * 60_000 });
  const jobsQ = useQuery({
    queryKey: ["jobs-count"],
    queryFn: () => getJobs(1),
    staleTime: 10 * 60_000,
  });

  const topIndices = (indicesQ.data?.indices ?? []).slice(0, 4);
  const chapterCount = chaptersQ.data?.length ?? "…";
  const catalogCount = catalogsQ.data?.count ?? "…";
  const totalItems = (catalogsQ.data?.catalogs ?? []).reduce((a, c) => a + (c.count || 0), 0);
  const jobsTotal = jobsQ.data?.total;

  const cards = [
    { icon: "📚", title: "Learn", desc: `${chapterCount} chapters · deep dives · AI chat`, to: "Learn", nested: false },
    { icon: "📋", title: "All Web Menus", desc: "The exact web sidebar — every section, pin to pin", to: "WebMenu", nested: true },
    { icon: "🗃️", title: "Catalogs", desc: `${totalItems.toLocaleString()} items across ${catalogCount} datasets`, to: "Catalogs", nested: false },
    { icon: "📈", title: "Market", desc: "Live indices, stocks & crypto quotes", to: "Market", nested: false },
    { icon: "📰", title: "News", desc: "AI news from 200+ RSS & scraped sources", to: "News", nested: true },
    { icon: "🎬", title: "Video Hub", desc: "YouTube · TikTok · Instagram · Facebook · X", to: "VideoHub", nested: true },
    { icon: "💼", title: "LinkedIn Posts", desc: "Daily deterministic AI posts", to: "LinkedInPosts", nested: true },
    { icon: "🧑‍💻", title: "AI Jobs", desc: jobsTotal ? `${jobsTotal.toLocaleString()} curated AI jobs` : "2,000+ curated AI job listings", to: "Jobs", nested: true },
    { icon: "📊", title: "Trading Desk", desc: "Gainers, losers, movers & live picks", to: "Trading", nested: true },
    { icon: "🤖", title: "Financial Advisor", desc: "Deep stock analysis & market news", to: "Advisor", nested: true },
    { icon: "📂", title: "Files & Gallery", desc: "Images, PDFs, docs from the server", to: "FilesGallery", nested: true },
    { icon: "⚙️", title: "Settings", desc: "Server address & connection", to: "Settings", nested: true },
  ];

  return (
    <FlatList
      style={baseStyles.screen}
      data={cards}
      keyExtractor={(c) => c.title}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
      ListHeaderComponent={
        <View style={{ paddingTop: insets.top + spacing.md, marginBottom: spacing.lg }}>
          {/* Hero */}
          <View style={[styles.hero, shadow(2)]}>
            <Text style={styles.heroTitle}>🧠 AI Knowledge Hub</Text>
            <Text style={styles.heroSub}>
              {typeof chapterCount === "number" ? `${chapterCount} chapters · ` : ""}
              {(catalogsQ.data?.catalogs ?? []).length} catalogs · live market · 200+ news sources
            </Text>
            <Text style={styles.heroServer}>server {getApiBaseUrl().replace(/^https?:\/\//, "")}</Text>
          </View>

          {/* Live indices strip */}
          <View style={[styles.indexStrip, shadow(1)]}>
            {topIndices.map((q) => (
              <View key={q.symbol} style={styles.indexCell}>
                <Text style={styles.indexName} numberOfLines={1}>
                  {q.name}
                </Text>
                <Text style={styles.indexPrice}>
                  {q.price != null ? q.price.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "—"}
                </Text>
                <Text style={[styles.indexPct, { color: (q.changePct ?? 0) >= 0 ? colors.green : colors.red }]}>
                  {q.changePct != null ? `${q.changePct >= 0 ? "+" : ""}${q.changePct.toFixed(2)}%` : "—"}
                </Text>
              </View>
            ))}
            {!topIndices.length && (
              <Text style={styles.indexPlaceholder}>Indices load when the server is reachable</Text>
            )}
          </View>

          <SectionLabel>Explore</SectionLabel>
        </View>
      }
      renderItem={({ item }) => (
        <TileCard
          icon={item.icon}
          title={item.title}
          desc={item.desc}
          onPress={() => (item.nested ? nav.navigate("More", { screen: item.to }) : nav.navigate(item.to))}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  heroTitle: { color: colors.text, fontSize: type.largeTitle.fontSize, fontWeight: "800", letterSpacing: 0.2 },
  heroSub: { color: colors.textDim, fontSize: type.callout.fontSize, marginTop: 6, lineHeight: 18 },
  heroServer: { color: colors.textFaint, fontSize: type.caption.fontSize, marginTop: 8, fontWeight: "600" },
  indexStrip: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  indexCell: { flex: 1, alignItems: "center" },
  indexName: { color: colors.textDim, fontSize: 11, fontWeight: "700" },
  indexPrice: { color: colors.text, fontSize: 15, fontWeight: "800", marginTop: 3 },
  indexPct: { fontSize: 11, fontWeight: "700", marginTop: 2 },
  indexPlaceholder: { color: colors.textFaint, fontSize: 12, flex: 1, textAlign: "center" },
});
