import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getChapters, getDeepDives, Chapter } from "../api/api";
import { colors, baseStyles, spacing } from "../theme/theme";
import { LoadingView, ErrorView, ScreenHeader, TileCard } from "../components/ui";
import type { LearnStackParams } from "../navigation/LearnStack";

type Nav = NativeStackNavigationProp<LearnStackParams>;

type Entry = Chapter & { kind: "chapter" | "deep-dive" };

const CATALOG_TILES: { key: string; title: string; icon: string; desc: string }[] = [
  { key: "ai_stack", title: "AI Stack Reference", icon: "🧱", desc: "68-module full-stack AI reference" },
  { key: "playbook", title: "AI Eng Playbook", icon: "📖", desc: "70-chapter engineering playbook" },
  { key: "rapid_fire", title: "Rapid Fire Drills", icon: "⚡", desc: "Fast-fire concept & interview drills" },
  { key: "ml_fundamentals", title: "ML Fundamentals", icon: "🔬", desc: "Rich ML concepts with code" },
  { key: "python_masterhub", title: "Python MasterHub", icon: "🎓", desc: "885-topic Python mastery path" },
  { key: "python_tutorials", title: "Python Tutorials", icon: "🐍", desc: "56 structured tutorials" },
  { key: "tech_lessons", title: "Tech Lessons", icon: "🛠️", desc: "1000+ technology lessons" },
  { key: "topic_content", title: "Topic Library", icon: "📝", desc: "885 long-form topic lessons" },
];

export default function LearnHomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const chaptersQ = useQuery({ queryKey: ["chapters"], queryFn: getChapters, staleTime: 5 * 60_000 });
  const divesQ = useQuery({ queryKey: ["deep-dives"], queryFn: getDeepDives, staleTime: 5 * 60_000 });

  const chapters: Entry[] = (chaptersQ.data ?? []).map((c) => ({ ...c, kind: "chapter" as const }));
  const dives: Entry[] = (divesQ.data ?? []).map((d) => ({ ...d, kind: "deep-dive" as const }));
  const all = [...chapters, ...dives];

  const filtered = all.filter(
    (c) =>
      !query.trim() ||
      c.title?.toLowerCase().includes(query.toLowerCase()) ||
      (c.tags ?? []).some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const open = useCallback(
    (item: Entry) => {
      navigation.navigate("ChapterDetail", { id: item.id, kind: item.kind });
    },
    [navigation]
  );

  if (chaptersQ.isLoading || divesQ.isLoading) return <LoadingView label="Loading library…" />;
  if (chaptersQ.isError || divesQ.isError)
    return (
      <ErrorView
        message={(chaptersQ.error as Error)?.message ?? String(divesQ.error)}
        onRetry={() => {
          chaptersQ.refetch();
          divesQ.refetch();
        }}
      />
    );

  return (
    <View style={baseStyles.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => `${item.kind}-${item.id}`}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + spacing.sm, marginBottom: spacing.md }}>
            <ScreenHeader title="📚 Learn" subtitle={`${chapters.length} chapters · ${dives.length} deep dives · guided catalogs`} />

            <Text style={baseStyles.sectionLabel}>Guided Catalogs</Text>
            {CATALOG_TILES.map((t) => (
              <TileCard
                key={t.key}
                icon={t.icon}
                title={t.title}
                desc={t.desc}
                onPress={() =>
                  navigation.navigate("CatalogList", {
                    catalogKey: t.key,
                    title: t.title,
                    icon: t.icon,
                    desc: t.desc,
                  })
                }
              />
            ))}

            <Text style={[baseStyles.sectionLabel, { marginTop: spacing.lg }]}>Chapters & Deep Dives</Text>
            <View style={styles.searchWrap}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Filter by title or tag…"
                placeholderTextColor={colors.textFaint}
                style={styles.searchInput}
                autoCapitalize="none"
              />
            </View>
            <Pressable style={styles.chatBtn} onPress={() => navigation.navigate("SearchChat")}>
              <Text style={styles.chatBtnText}>🔍  Ask the AI Knowledge Chat</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={baseStyles.card} onPress={() => open(item)}>
            <View style={baseStyles.row}>
              <Text style={[baseStyles.title, { flex: 1 }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.badge}>{item.kind === "deep-dive" ? "DEEP DIVE" : "CHAPTER"}</Text>
            </View>
            {item.preview ? (
              <Text style={baseStyles.subtitle} numberOfLines={2}>
                {item.preview}
              </Text>
            ) : null}
            {(item.tags ?? []).length ? (
              <Text style={baseStyles.faint} numberOfLines={1}>
                {(item.tags ?? []).slice(0, 6).join(" · ")}
              </Text>
            ) : null}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: { color: colors.text, fontSize: 15, paddingVertical: 12 },
  chatBtn: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  chatBtnText: { color: colors.accent, fontWeight: "700", fontSize: 14 },
  badge: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: spacing.sm,
  },
});
