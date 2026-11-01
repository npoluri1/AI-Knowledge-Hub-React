import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  RefreshControl,
  Linking,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getJobs, Job } from "../api/api";
import { colors, baseStyles, spacing } from "../theme/theme";
import { LoadingView, ErrorView, ScreenHeader } from "../components/ui";

/** Extract a display value from loosely-typed job records. */
function field(job: Job, key: string): string {
  const v = job[key];
  return typeof v === "string" ? v : "";
}

export default function JobsScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("");

  const jobsQ = useQuery({
    queryKey: ["jobs"],
    queryFn: () => getJobs(2000),
    staleTime: 10 * 60_000,
  });

  const jobs: Job[] = jobsQ.data?.jobs ?? [];

  const sources = useMemo(() => {
    const set = new Set<string>();
    for (const j of jobs) {
      const s = field(j, "source");
      if (s) set.add(s);
    }
    return Array.from(set).sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (source && field(j, "source").toLowerCase() !== source.toLowerCase()) return false;
      if (!q) return true;
      const hay = [
        field(j, "title"),
        field(j, "company"),
        field(j, "location"),
        Array.isArray(j.techs) ? (j.techs as unknown[]).join(" ") : "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [jobs, query, source]);

  const openJob = async (job: Job) => {
    const url = field(job, "url") || field(job, "link");
    if (url && /^https?:\/\//.test(url)) await Linking.openURL(url);
  };

  if (jobsQ.isLoading) return <LoadingView label="Loading job listings…" />;
  if (jobsQ.isError)
    return <ErrorView message={(jobsQ.error as Error).message} onRetry={() => jobsQ.refetch()} />;

  return (
    <View style={baseStyles.screen}>
      <FlatList
        data={filtered.slice(0, 300)}
        keyExtractor={(j, i) => `${field(j, "url") || field(j, "title")}-${i}`}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        refreshControl={
          <RefreshControl refreshing={jobsQ.isFetching} onRefresh={() => jobsQ.refetch()} tintColor={colors.accent} />
        }
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + spacing.sm, marginBottom: spacing.md }}>
            <ScreenHeader
              title="🧑‍💻 AI Jobs"
              subtitle={`${filtered.length} of ${jobsQ.data?.total ?? jobs.length} listings`}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search title, company, tech (RAG, LangChain…)"
              placeholderTextColor={colors.textFaint}
              style={styles.search}
              autoCapitalize="none"
            />
            {sources.length > 1 ? (
              <View style={styles.sourceRow}>
                <Pressable
                  style={[styles.sourceChip, !source && styles.sourceChipOn]}
                  onPress={() => setSource("")}
                >
                  <Text style={[styles.sourceText, !source && styles.sourceTextOn]}>All</Text>
                </Pressable>
                {sources.map((s) => (
                  <Pressable
                    key={s}
                    style={[styles.sourceChip, source === s && styles.sourceChipOn]}
                    onPress={() => setSource(s)}
                  >
                    <Text style={[styles.sourceText, source === s && styles.sourceTextOn]}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>No jobs match your search.</Text>}
        renderItem={({ item }) => (
          <Pressable style={baseStyles.card} onPress={() => openJob(item)}>
            <Text style={baseStyles.title} numberOfLines={2}>
              {field(item, "title") || "Untitled role"}
            </Text>
            <Text style={styles.company}>
              {[field(item, "company"), field(item, "location")].filter(Boolean).join(" · ") || "—"}
            </Text>
            {field(item, "salary") ? <Text style={styles.salary}>💰 {field(item, "salary")}</Text> : null}
            {Array.isArray(item.techs) && (item.techs as unknown[]).length ? (
              <View style={styles.techRow}>
                {(item.techs as unknown[]).slice(0, 8).map((t, i) => (
                  <View key={i} style={baseStyles.pill}>
                    <Text style={baseStyles.pillText}>{String(t)}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            {field(item, "source") ? <Text style={baseStyles.faint}>via {field(item, "source")}</Text> : null}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  sourceRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  sourceChip: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sourceChipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  sourceText: { color: colors.textDim, fontSize: 12, fontWeight: "700" },
  sourceTextOn: { color: "#fff" },
  company: { color: colors.textDim, fontSize: 13, marginTop: 2 },
  salary: { color: colors.green, fontSize: 13, fontWeight: "700", marginTop: spacing.sm },
  techRow: { flexDirection: "row", flexWrap: "wrap", marginTop: spacing.sm },
  empty: { color: colors.textDim, textAlign: "center", marginTop: spacing.xl },
});
