import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Linking,
  StyleSheet,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getFiles, FileRecord } from "../api/api";
import { getApiBaseUrl } from "../api/client";
import { colors, baseStyles, spacing, radius, shadow } from "../theme/theme";
import { LoadingView, ErrorView, LargeTitle, EmptyView } from "../components/ui";

type Bucket = "images" | "pdfs" | "documents" | "dataFiles";

const BUCKETS: { key: Bucket; label: string; icon: string }[] = [
  { key: "images", label: "Images", icon: "🖼" },
  { key: "pdfs", label: "PDFs", icon: "📄" },
  { key: "documents", label: "Docs", icon: "📝" },
  { key: "dataFiles", label: "Data", icon: "🗄" },
];

/** Build a resolvable URL for a file served by the frontend dev server. */
function fileUrl(f: FileRecord): string {
  if (f.url.startsWith("http")) return f.url;
  // /api/raw/... streams through the API server; /images & /data through the
  // SAME origin the app is loaded from (Metro proxies them to the frontend).
  return `${getApiBaseUrl()}${f.url}`;
}

export default function FilesGalleryScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [bucket, setBucket] = useState<Bucket>("images");

  const filesQ = useQuery({ queryKey: ["files"], queryFn: getFiles, staleTime: 2 * 60_000 });
  const data = filesQ.data;
  const items: FileRecord[] = data?.[bucket] ?? [];

  const open = (f: FileRecord) => {
    const url = fileUrl(f);
    if (bucket === "images") {
      navigation.navigate("ImageViewer", { url, title: f.display_name });
    } else {
      Linking.openURL(url);
    }
  };

  if (filesQ.isLoading) return <LoadingView label="Scanning server files…" />;
  if (filesQ.isError) return <ErrorView message={(filesQ.error as Error).message} onRetry={() => filesQ.refetch()} />;

  return (
    <View style={baseStyles.screen}>
      <FlatList
        data={bucket === "images" ? items.slice(0, 200) : items.slice(0, 300)}
        keyExtractor={(f, i) => `${f.folder}-${f.name}-${i}`}
        numColumns={bucket === "images" ? 3 : 1}
        contentContainerStyle={{ padding: spacing.lg, ...(bucket === "images" ? { paddingHorizontal: spacing.md } : {}), paddingBottom: spacing.xxl }}
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + spacing.sm, marginBottom: spacing.md }}>
            <LargeTitle
              title="Files & Gallery"
              subtitle={data ? `${data.totals.total} files · ${data.totals.images} images · ${data.totals.pdfs} PDFs` : "…"}
            />
            <View style={styles.bucketRow}>
              {BUCKETS.map((b) => (
                <Pressable
                  key={b.key}
                  style={({ pressed }) => [
                    styles.bucketChip,
                    bucket === b.key && styles.bucketChipOn,
                    pressed && { opacity: 0.85 },
                  ]}
                  onPress={() => setBucket(b.key)}
                >
                  <Text style={[styles.bucketText, bucket === b.key && styles.bucketTextOn]}>
                    {b.icon} {b.label} {data ? `(${data[b.key].length})` : ""}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyView message="No files in this bucket" />}
        renderItem={({ item }) =>
          bucket === "images" ? (
            <Pressable
              style={({ pressed }) => [styles.cell, pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] }]}
              onPress={() => open(item)}
            >
              <Image source={{ uri: fileUrl(item) }} style={styles.thumb} resizeMode="cover" />
              <Text style={styles.cellLabel} numberOfLines={1}>
                {item.display_name}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.docRow, shadow(1), pressed && { opacity: 0.85 }]}
              onPress={() => open(item)}
            >
              <Text style={styles.docIcon}>📄</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.docTitle} numberOfLines={2}>
                  {item.display_name}
                </Text>
                <Text style={styles.docMeta}>
                  {item.type} · {item.size} · {item.source_label}
                </Text>
              </View>
              <Text style={styles.docChevron}>›</Text>
            </Pressable>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bucketRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.sm },
  bucketChip: {
    backgroundColor: colors.card,
    borderColor: colors.borderSoft,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  bucketChipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  bucketText: { color: colors.textDim, fontSize: 12, fontWeight: "700" },
  bucketTextOn: { color: colors.white, fontWeight: "700" },
  cell: {
    flex: 1 / 3,
    margin: 2,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.card,
    ...shadow(1),
  },
  thumb: { width: "100%", aspectRatio: 1, backgroundColor: colors.cardAlt },
  cellLabel: { color: colors.textDim, fontSize: 10, padding: 6 },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  docIcon: { fontSize: 22, marginRight: spacing.md },
  docTitle: { color: colors.text, fontSize: 14, fontWeight: "600" },
  docMeta: { color: colors.textFaint, fontSize: 11, marginTop: 3 },
  docChevron: { color: colors.textFaint, fontSize: 22, marginLeft: spacing.sm },
});
