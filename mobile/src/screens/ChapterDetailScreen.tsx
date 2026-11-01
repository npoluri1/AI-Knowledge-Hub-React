import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getChapter, getDeepDive, ChapterSection } from "../api/api";
import { colors, baseStyles, spacing } from "../theme/theme";
import { LoadingView, ErrorView } from "../components/ui";

/** Recursively flatten nested sections for rendering. */
function flatten(sections: ChapterSection[] | undefined, depth = 0): { s: ChapterSection; depth: number }[] {
  if (!sections?.length) return [];
  const out: { s: ChapterSection; depth: number }[] = [];
  for (const s of sections) {
    out.push({ s, depth });
    if (s.sections?.length) out.push(...flatten(s.sections, depth + 1));
  }
  return out;
}

function SectionBlock({ s, depth }: { s: ChapterSection; depth: number }) {
  const heading = s.heading ?? "";
  const body = s.text ?? s.insight ?? s.concept ?? s.scenario ?? s.warning ?? "";
  return (
    <View style={[styles.section, depth > 0 && styles.nested]}>
      {heading ? <Text style={[styles.heading, depth > 0 && styles.headingNested]}>{heading}</Text> : null}
      {body ? <Text style={baseStyles.body}>{body}</Text> : null}
      {s.warning ? <Text style={styles.warning}>⚠️ {s.warning}</Text> : null}
    </View>
  );
}

export default function ChapterDetailScreen({ route }: any) {
  const { id, kind } = route.params as { id: string; kind: "chapter" | "deep-dive" };
  const q = useQuery({
    queryKey: [kind, id],
    queryFn: () => (kind === "deep-dive" ? getDeepDive(id) : getChapter(id)),
    staleTime: 5 * 60_000,
  });

  if (q.isLoading) return <LoadingView />;
  if (q.isError) return <ErrorView message={(q.error as Error).message} onRetry={() => q.refetch()} />;

  const data = q.data as any;
  if (!data || data.error) return <ErrorView message={data?.error ?? "Not found"} />;

  const sections = flatten(data.sections);

  return (
    <ScrollView style={baseStyles.screen} contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
      <Text style={styles.h1}>{data.title}</Text>
      {data.preview || data.description ? (
        <Text style={[baseStyles.body, { color: colors.textDim, marginTop: spacing.sm }]}>
          {data.preview ?? data.description}
        </Text>
      ) : null}
      {data.tags?.length ? (
        <View style={styles.tagRow}>
          {data.tags.map((t: string, i: number) => (
            <View key={`${t}-${i}`} style={baseStyles.pill}>
              <Text style={baseStyles.pillText}>{t}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {sections.map(({ s, depth }, i) => (
        <SectionBlock key={i} s={s} depth={depth} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { color: colors.text, fontSize: 24, fontWeight: "800", lineHeight: 30 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", marginTop: spacing.md },
  section: { marginTop: spacing.lg },
  nested: { paddingLeft: spacing.md, borderLeftWidth: 2, borderLeftColor: colors.border },
  heading: { color: colors.accent, fontSize: 17, fontWeight: "700", marginBottom: spacing.sm },
  headingNested: { fontSize: 15 },
  warning: { color: colors.amber, fontSize: 13, marginTop: spacing.sm },
});
