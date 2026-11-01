import React, { useState } from "react";
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
import { getDailyPosts, getPostTopics, LinkedInPost } from "../api/api";
import { colors, baseStyles, spacing } from "../theme/theme";
import { LoadingView, ErrorView, ScreenHeader, ChipRow } from "../components/ui";

function todayIso(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export default function LinkedInPostsScreen() {
  const insets = useSafeAreaInsets();
  const [date, setDate] = useState(todayIso());
  const [dateInput, setDateInput] = useState(todayIso());
  const [topic, setTopic] = useState("");

  const topicsQ = useQuery({ queryKey: ["li-topics"], queryFn: getPostTopics, staleTime: 10 * 60_000 });
  const postsQ = useQuery({
    queryKey: ["li-daily", date, topic],
    queryFn: () => getDailyPosts(date, topic || undefined, 6),
    staleTime: 5 * 60_000,
  });

  const topics: { key: string; label: string }[] = [
    { key: "", label: "🎲 Mixed" },
    ...(topicsQ.data?.topics ?? []).map((t) => ({ key: t, label: t })),
  ];

  const posts: LinkedInPost[] = postsQ.data?.posts ?? [];

  const shiftDay = (delta: number) => {
    const d = new Date(date + "T00:00:00");
    d.setDate(d.getDate() + delta);
    const iso = d.toISOString().slice(0, 10);
    setDate(iso);
    setDateInput(iso);
  };

  const commitDate = () => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) setDate(dateInput.trim());
  };

  if (postsQ.isLoading) return <LoadingView label="Generating daily posts…" />;
  if (postsQ.isError)
    return <ErrorView message={(postsQ.error as Error).message} onRetry={() => postsQ.refetch()} />;

  return (
    <View style={baseStyles.screen}>
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + spacing.sm, marginBottom: spacing.md }}>
            <ScreenHeader title="💼 LinkedIn Posts" subtitle={`${posts.length} posts · ${date}`} />

            {/* Date navigation */}
            <View style={styles.dateRow}>
              <Pressable style={styles.dateBtn} onPress={() => shiftDay(-1)}>
                <Text style={styles.dateBtnText}>←</Text>
              </Pressable>
              <TextInput
                value={dateInput}
                onChangeText={setDateInput}
                onSubmitEditing={commitDate}
                onBlur={commitDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textFaint}
                style={styles.dateInput}
              />
              <Pressable style={styles.dateBtn} onPress={() => shiftDay(1)}>
                <Text style={styles.dateBtnText}>→</Text>
              </Pressable>
              <Pressable style={[styles.dateBtn, { flex: undefined, paddingHorizontal: 12 }]} onPress={() => { const t = todayIso(); setDate(t); setDateInput(t); }}>
                <Text style={styles.dateBtnText}>Today</Text>
              </Pressable>
            </View>

            <ChipRow items={topics} activeKey={topic} onSelect={setTopic} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={baseStyles.card}>
            <View style={baseStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.profile}>{item.profile}</Text>
                <Text style={baseStyles.faint}>{item.profileTagline}</Text>
              </View>
              <Text style={styles.topicTag}>{item.topic}</Text>
            </View>
            <Text style={[baseStyles.title, { marginTop: spacing.sm }]}>{item.title}</Text>
            <Text style={styles.content}>{item.content}</Text>
            <View style={styles.tagRow}>
              {item.tags.map((t, i) => (
                <View key={i} style={baseStyles.pill}>
                  <Text style={baseStyles.pillText}>#{t}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dateRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md, alignItems: "center" },
  dateBtn: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignItems: "center",
  },
  dateBtnText: { color: colors.text, fontWeight: "700", fontSize: 14 },
  dateInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    fontSize: 14,
  },
  profile: { color: colors.accent, fontWeight: "800", fontSize: 14 },
  topicTag: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: "800",
    backgroundColor: colors.cardAlt,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: "hidden",
  },
  content: { color: colors.text, fontSize: 14, lineHeight: 21, marginTop: spacing.sm },
  tagRow: { flexDirection: "row", flexWrap: "wrap", marginTop: spacing.md },
});
