import React from "react";
import { ScrollView, View, Text, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getApiBaseUrl } from "../api/client";
import { colors, baseStyles, spacing, type, radius, shadow } from "../theme/theme";
import { LoadingView, ErrorView, LargeTitle, ListRow } from "../components/ui";
import { Markdownish } from "../components/RichContent";

export default function EdurekaDocsScreen({ route, navigation }: any) {
  const docId: string | undefined = route?.params?.docId;

  const docQ = useQuery({
    queryKey: ["edureka-doc", docId],
    queryFn: () =>
      fetch(`${getApiBaseUrl()}/api/catalog/edureka_docs/get?name=${encodeURIComponent(docId!)}`).then((r) =>
        r.json()
      ),
    enabled: !!docId,
  });

  const listQ = useQuery({
    queryKey: ["edureka-docs"],
    queryFn: () =>
      fetch(`${getApiBaseUrl()}/api/catalog/edureka_docs/list`).then((r) => r.json()),
    enabled: !docId,
  });

  React.useEffect(() => {
    if (docId && navigation?.setOptions) navigation.setOptions({ title: "Edureka Doc" });
  }, [docId]);

  // ── Single doc reader ──
  if (docId) {
    if (docQ.isLoading) return <LoadingView label="Loading document…" />;
    if (docQ.isError) return <ErrorView message={String((docQ.error as Error)?.message)} />;
    const content: string = docQ.data?.content ?? docQ.data?.error ?? "";
    return (
      <ScrollView style={baseStyles.screen} contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Markdownish text={content} />
      </ScrollView>
    );
  }

  // ── Doc list ──
  if (listQ.isLoading) return <LoadingView label="Loading docs…" />;
  if (listQ.isError) return <ErrorView message={String((listQ.error as Error)?.message)} onRetry={() => listQ.refetch()} />;
  const docs = listQ.data?.docs ?? [];

  return (
    <View style={baseStyles.screen}>
      <FlatList
        data={docs}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        ListHeaderComponent={<LargeTitle title="Edureka AI Docs" subtitle={`${docs.length} curated reference documents`} />}
        renderItem={({ item: d }) => (
          <ListRow
            icon={d.kind === "md" ? "📗" : "📙"}
            title={d.title}
            meta={`${(d.size / 1024).toFixed(0)} KB`}
            onPress={() => navigation.navigate("EdurekaDoc", { docId: d.id })}
          />
        )}
      />
    </View>
  );
}
