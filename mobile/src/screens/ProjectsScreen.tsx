import React, { useState } from "react";
import { ScrollView, View, Text, FlatList, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getApiBaseUrl } from "../api/client";
import { colors, baseStyles, spacing, type, radius, shadow } from "../theme/theme";
import { LoadingView, ErrorView, LargeTitle, ListRow, ChipRow, SectionLabel } from "../components/ui";
import { Markdownish } from "../components/RichContent";

type Proj = {
  id: string;
  name: string;
  title: string;
  path: string;
  stacks?: string[];
  kind?: string;
  commands?: Record<string, string | null>;
};

function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => fetch(`${getApiBaseUrl()}/api/projects`).then((r) => r.json()),
    staleTime: 5 * 60_000,
  });
}

export function ProjectsListScreen({ navigation }: any) {
  const [rootIdx, setRootIdx] = useState(0);
  const projectsQ = useProjects();
  const groups = projectsQ.data?.groups ?? [];
  const group = groups[rootIdx];
  const projects: Proj[] = group?.projects ?? [];

  if (projectsQ.isLoading) return <LoadingView label="Scanning projects…" />;
  if (projectsQ.isError) return <ErrorView message={String((projectsQ.error as Error)?.message)} onRetry={() => projectsQ.refetch()} />;

  return (
    <View style={baseStyles.screen}>
      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        ListHeaderComponent={
          <View>
            <LargeTitle
              title="All Projects"
              subtitle={`${projectsQ.data?.total ?? "…"} projects across ${groups.length} roots`}
            />
            <ChipRow
              items={groups.map((g: any, i: number) => ({ key: String(i), label: g.rootName ?? `Root ${i + 1} (${g.count})` }))}
              activeKey={String(rootIdx)}
              onSelect={(k) => setRootIdx(Number(k))}
            />
          </View>
        }
        renderItem={({ item: p }) => (
          <ListRow
            icon={p.kind === "python" ? "🐍" : p.kind === "node" ? "⬢" : "🗂️"}
            title={p.title || p.name}
            subtitle={(p.stacks ?? []).join(" · ")}
            meta={p.path?.split("\\").slice(-2).join(" \\ ")}
            onPress={() => navigation.navigate("ProjectDetail", { path: p.path, title: p.title || p.name })}
          />
        )}
      />
    </View>
  );
}

export function ProjectDetailScreen({ route, navigation }: any) {
  const { path, title } = route.params;
  const detailQ = useQuery({
    queryKey: ["project-detail", path],
    queryFn: () =>
      fetch(`${getApiBaseUrl()}/api/projects/detail?path=${encodeURIComponent(path)}`).then((r) => r.json()),
  });

  React.useEffect(() => {
    navigation?.setOptions?.({ title: title ?? "Project" });
  }, [title]);

  if (detailQ.isLoading) return <LoadingView label="Reading project…" />;
  if (detailQ.isError) return <ErrorView message={String((detailQ.error as Error)?.message)} onRetry={() => detailQ.refetch()} />;
  const d = detailQ.data;
  if (!d || d.error) return <ErrorView message={d?.error ?? "Unknown project"} />;

  const source = d.source ?? [];
  const src: { path: string; content: string }[] = Array.isArray(source)
    ? source.slice(0, 8)
    : Object.entries(source ?? {}).slice(0, 8).map(([k, v]) => ({ path: k, content: String(v) }));

  return (
    <ScrollView style={baseStyles.screen} contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
      {d.readme ? (
        <View style={[styles.readmeCard, shadow(1)]}>
          <Markdownish text={d.readme} />
        </View>
      ) : null}

      {src.length ? (
        <>
          <SectionLabel>Source Files</SectionLabel>
          {src.map((s) => (
            <View key={s.path} style={[styles.codeCard, shadow(1)]}>
              <Text style={styles.codePath}>{s.path}</Text>
              <Text style={styles.codeContent} selectable>
                {s.content.length > 3000 ? `${s.content.slice(0, 3000)}\n… (truncated)` : s.content}
              </Text>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  readmeCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  codeCard: {
    backgroundColor: "#0a0f1f",
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  codePath: { color: colors.accent, fontSize: type.footnote.fontSize, fontWeight: "700", marginBottom: 6 },
  codeContent: { color: "#9ecbff", fontSize: 11.5, lineHeight: 17 },
});
