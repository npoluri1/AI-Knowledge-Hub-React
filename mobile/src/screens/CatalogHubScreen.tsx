import React, { useMemo, useState } from "react";
import { FlatList, Text, View, StyleSheet, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getCatalogs } from "../api/api";
import { colors, baseStyles, spacing, type, radius, shadow } from "../theme/theme";
import { EmptyView, ErrorView, LargeTitle, LoadingView, SearchBar } from "../components/ui";

/** Groups with iOS-style accent colors per section. */
const GROUPS: { label: string; tint: string; keys: string[] }[] = [
  {
    label: "📚 Books & Reference",
    tint: "#f59e0b",
    keys: ["books", "books_categories", "reference_library", "knowledge_table"],
  },
  {
    label: "🤖 AI Tools & Agents",
    tint: "#8b5cf6",
    keys: ["tools", "tool_details", "agents", "agents_directory", "chatbots", "open_alternatives", "integrations"],
  },
  {
    label: "📦 Repos & Code",
    tint: "#0ea5e9",
    keys: ["github", "use_cases", "chapter_sections", "deep_dive_sections", "topic_content"],
  },
  {
    label: "🎓 Learning & Guides",
    tint: "#22c55e",
    keys: ["ai_stack", "playbook", "rapid_fire", "ml_fundamentals", "resources", "ccaf", "study_by_doing", "learning_catalog"],
  },
  {
    label: "❄️ Industry Guides",
    tint: "#38bdf8",
    keys: ["snowflake", "etl", "industry_matrix", "mortalapps", "ai_blogs"],
  },
  {
    label: "🐍 Python & Technologies",
    tint: "#f97316",
    keys: ["python_tutorials", "python_masterhub", "python_tech", "python_topics", "tech_lessons"],
  },
];

type Cat = { key: string; title: string; icon: string; desc: string; count: number };

function CatalogTile({ cat, tint, onPress }: { cat: Cat; tint: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        shadow(1),
        pressed && { transform: [{ scale: 0.97 }], opacity: 0.92 },
      ]}
    >
      <View style={[styles.tileIconWrap, { backgroundColor: `${tint}22` }]}>
        <Text style={styles.tileIcon}>{cat.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.tileTitle} numberOfLines={1}>
          {cat.title}
        </Text>
        <Text style={styles.tileDesc} numberOfLines={2}>
          {cat.desc}
        </Text>
      </View>
      <View style={[styles.countPill, { backgroundColor: `${tint}1f` }]}>
        <Text style={[styles.countText, { color: tint }]}>{cat.count.toLocaleString()}</Text>
      </View>
    </Pressable>
  );
}

export default function CatalogHubScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState("");

  const catalogsQ = useQuery({ queryKey: ["catalogs"], queryFn: getCatalogs, staleTime: 5 * 60_000 });
  const catalogs: Cat[] = catalogsQ.data?.catalogs ?? [];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return catalogs;
    return catalogs.filter(
      (c) => c.title.toLowerCase().includes(needle) || c.desc.toLowerCase().includes(needle) || c.key.includes(needle)
    );
  }, [catalogs, q]);

  const rows = useMemo(() => {
    const byKey = new Map(filtered.map((c) => [c.key, c]));
    const out: (
      | { type: "label"; label: string; tint: string }
      | { type: "cat"; cat: Cat; tint: string }
    )[] = [];
    const used = new Set<string>();
    for (const g of GROUPS) {
      const inGroup = g.keys.filter((k) => byKey.has(k));
      if (!inGroup.length) continue;
      out.push({ type: "label", label: g.label, tint: g.tint });
      for (const k of inGroup) {
        used.add(k);
        out.push({ type: "cat", cat: byKey.get(k)!, tint: g.tint });
      }
    }
    for (const c of filtered) if (!used.has(c.key)) out.push({ type: "cat", cat: c, tint: colors.accent });
    return out;
  }, [filtered]);

  if (catalogsQ.isLoading) return <LoadingView label="Loading catalogs…" />;
  if (catalogsQ.isError) return <ErrorView message={String((catalogsQ.error as Error)?.message)} onRetry={() => catalogsQ.refetch()} />;

  const totalItems = catalogs.reduce((a, c) => a + (c.count || 0), 0);

  return (
    <View style={[baseStyles.screen, { paddingTop: insets.top }]}>
      <FlatList
        data={rows}
        keyExtractor={(r, i) => (r.type === "label" ? `l-${r.label}` : `c-${r.cat.key}`)}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        ListHeaderComponent={
          <View>
            <LargeTitle
              title="Catalogs"
              subtitle={`${catalogs.length} datasets · ${totalItems.toLocaleString()} items — everything from the web app`}
            />
            <SearchBar value={q} onChange={setQ} placeholder="Search catalogs…" />
          </View>
        }
        renderItem={({ item: r }) =>
          r.type === "label" ? (
            <View style={styles.groupRow}>
              <View style={[styles.groupDot, { backgroundColor: r.tint }]} />
              <Text style={[styles.groupLabel, { color: r.tint }]}>{r.label}</Text>
            </View>
          ) : (
            <CatalogTile
              cat={r.cat}
              tint={r.tint}
              onPress={() =>
                navigation.navigate("CatalogList", {
                  catalogKey: r.cat.key,
                  title: r.cat.title,
                  icon: r.cat.icon,
                  desc: r.cat.desc,
                })
              }
            />
          )
        }
        ListEmptyComponent={<EmptyView message={`No catalogs match “${q}”`} icon="🔍" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  groupDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  groupLabel: { fontSize: type.caption.fontSize, fontWeight: "800", letterSpacing: 1.1, textTransform: "uppercase" },
  tile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  tileIconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.sm + 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  tileIcon: { fontSize: 21 },
  tileTitle: { color: colors.text, fontSize: type.headline.fontSize, fontWeight: "700" },
  tileDesc: { color: colors.textDim, fontSize: type.footnote.fontSize, marginTop: 2, lineHeight: 17 },
  countPill: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, marginLeft: spacing.sm },
  countText: { fontSize: type.caption.fontSize, fontWeight: "800" },
});
