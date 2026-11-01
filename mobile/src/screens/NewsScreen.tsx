import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getNewsSources, fetchNews, NewsItem } from "../api/api";
import { colors, baseStyles, spacing } from "../theme/theme";
import { LoadingView, ErrorView, ScreenHeader, ChipRow } from "../components/ui";

type SourceRes = { key: string; name: string; items: NewsItem[]; error?: string };

export default function NewsScreen() {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<SourceRes[] | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchErr, setFetchErr] = useState("");
  const [fetchedAt, setFetchedAt] = useState("");

  const sourcesQ = useQuery({
    queryKey: ["news-sources"],
    queryFn: () => getNewsSources(),
    staleTime: 10 * 60_000,
  });

  const sources = sourcesQ.data?.sources ?? [];
  const categories = useMemo(
    () => ["All", ...(sourcesQ.data?.categories ?? [])],
    [sourcesQ.data]
  );

  const visible = useMemo(
    () => (category === "All" ? sources : sources.filter((s) => s.category === category)),
    [sources, category]
  );

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const doFetch = async () => {
    setFetching(true);
    setFetchErr("");
    try {
      const res = await fetchNews(selected.join(","), 8);
      setResults(res.results ?? []);
      setFetchedAt(res.fetched_at ?? "");
    } catch (e) {
      setFetchErr((e as Error).message);
    } finally {
      setFetching(false);
    }
  };

  const flatItems = useMemo(() => {
    if (!results) return [];
    const out: (NewsItem & { sourceName: string; err?: string })[] = [];
    for (const r of results) {
      for (const it of r.items ?? []) out.push({ ...it, sourceName: r.name });
    }
    return out;
  }, [results]);

  if (sourcesQ.isLoading) return <LoadingView label="Loading news sources…" />;
  if (sourcesQ.isError)
    return <ErrorView message={(sourcesQ.error as Error).message} onRetry={() => sourcesQ.refetch()} />;

  return (
    <View style={baseStyles.screen}>
      <FlatList
        data={flatItems}
        keyExtractor={(item, i) => `${item.link ?? item.title}-${i}`}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        refreshControl={
          <RefreshControl refreshing={fetching} onRefresh={doFetch} tintColor={colors.accent} />
        }
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + spacing.sm, marginBottom: spacing.md }}>
            <ScreenHeader
              title="📰 AI News"
              subtitle={fetchedAt ? `Fetched ${fetchedAt}` : `${sources.length} sources ready`}
            />
            <ChipRow items={categories.map((c) => ({ key: c, label: c }))} activeKey={category} onSelect={setCategory} />

            <Text style={styles.hint}>
              {selected.length
                ? `${selected.length} source(s) selected`
                : "Tap sources below to narrow the fetch (none = all)"}
            </Text>
            <View style={styles.sourceWrap}>
              {visible.slice(0, 24).map((s) => (
                <Pressable
                  key={s.key}
                  style={[styles.sourceChip, selected.includes(s.key) && styles.sourceChipOn]}
                  onPress={() => toggle(s.key)}
                >
                  <Text style={[styles.sourceText, selected.includes(s.key) && styles.sourceTextOn]} numberOfLines={1}>
                    {s.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.fetchBtn} onPress={doFetch} disabled={fetching}>
              <Text style={styles.fetchBtnText}>
                {fetching ? "Fetching feeds (can take ~30s)…" : "⚡ Fetch latest news"}
              </Text>
            </Pressable>
            {fetchErr ? <Text style={styles.err}>{fetchErr}</Text> : null}
          </View>
        }
        ListEmptyComponent={
          !fetching ? (
            <Text style={styles.empty}>
              Pull down or tap "Fetch latest news" to load fresh articles.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={baseStyles.card}>
            <Text style={styles.sourceTag}>{item.sourceName}</Text>
            <Text style={baseStyles.title}>{item.title}</Text>
            {item.summary ? (
              <Text style={baseStyles.subtitle} numberOfLines={3}>
                {item.summary}
              </Text>
            ) : null}
            {item.published ? <Text style={baseStyles.faint}>{item.published}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { color: colors.textDim, fontSize: 12, marginBottom: spacing.sm },
  sourceWrap: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.md },
  sourceChip: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    maxWidth: 200,
  },
  sourceChipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  sourceText: { color: colors.textDim, fontSize: 12, fontWeight: "600" },
  sourceTextOn: { color: "#fff" },
  fetchBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  fetchBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  err: { color: colors.red, fontSize: 13, marginBottom: spacing.sm },
  empty: { color: colors.textDim, textAlign: "center", marginTop: spacing.xl, lineHeight: 20 },
  sourceTag: { color: colors.accent, fontSize: 11, fontWeight: "800", letterSpacing: 0.5, marginBottom: 4 },
});
