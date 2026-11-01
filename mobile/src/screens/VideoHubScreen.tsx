import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  Linking,
  RefreshControl,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getVideoTopics, discoverVideos, VideoItem } from "../api/api";
import { colors, baseStyles, spacing } from "../theme/theme";
import { LoadingView, ErrorView, ScreenHeader, ChipRow } from "../components/ui";

export default function VideoHubScreen() {
  const insets = useSafeAreaInsets();
  const [topic, setTopic] = useState("");

  const topicsQ = useQuery({ queryKey: ["video-topics"], queryFn: getVideoTopics, staleTime: 10 * 60_000 });
  const videosQ = useQuery({
    queryKey: ["videos", topic],
    queryFn: () => discoverVideos({ topic: topic || undefined, max_results: 24 }),
    staleTime: 5 * 60_000,
  });

  const topics = useMemo(
    () => [
      { key: "", label: "🔥 All" },
      ...(topicsQ.data?.topics ?? []).map((t) => ({ key: t.key, label: t.label })),
    ],
    [topicsQ.data]
  );

  const items: VideoItem[] = videosQ.data?.items ?? [];

  const openVideo = async (item: VideoItem) => {
    const url =
      item.url ??
      (item.videoId ? `https://www.youtube.com/watch?v=${item.videoId}` : undefined);
    if (url) await Linking.openURL(url);
  };

  const thumb = (item: VideoItem) => {
    if (item.thumbnail) return { uri: item.thumbnail };
    if (item.videoId) return { uri: `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg` };
    return undefined;
  };

  if (videosQ.isLoading && !items.length) return <LoadingView label="Discovering videos…" />;
  if (videosQ.isError)
    return <ErrorView message={(videosQ.error as Error).message} onRetry={() => videosQ.refetch()} />;

  return (
    <View style={baseStyles.screen}>
      <FlatList
        data={items}
        keyExtractor={(v, i) => v.videoId ?? v.id ?? `v-${i}`}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        refreshControl={
          <RefreshControl refreshing={videosQ.isFetching} onRefresh={() => videosQ.refetch()} tintColor={colors.accent} />
        }
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + spacing.sm, marginBottom: spacing.md }}>
            <ScreenHeader title="🎬 Video Hub" subtitle={`${items.length} videos · tap to open`} />
            <ChipRow items={topics} activeKey={topic} onSelect={setTopic} />
            {videosQ.data?.error ? <Text style={styles.note}>{videosQ.data.error}</Text> : null}
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>No videos for this topic yet — try another.</Text>}
        renderItem={({ item }) => (
          <Pressable style={baseStyles.card} onPress={() => openVideo(item)}>
            <View style={baseStyles.row}>
              {thumb(item) ? (
                <Image source={thumb(item)!} style={styles.thumb} resizeMode="cover" />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Text style={{ fontSize: 22 }}>▶️</Text>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={baseStyles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={baseStyles.faint} numberOfLines={1}>
                  {[item.channel, item.topicLabel, item.kind].filter(Boolean).join(" · ")}
                </Text>
                {item.published ? <Text style={baseStyles.faint}>{String(item.published).slice(0, 10)}</Text> : null}
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  thumb: { width: 110, height: 62, borderRadius: 8, backgroundColor: colors.cardAlt },
  thumbPlaceholder: { alignItems: "center", justifyContent: "center" },
  note: { color: colors.amber, fontSize: 12, marginBottom: spacing.sm, lineHeight: 17 },
  empty: { color: colors.textDim, textAlign: "center", marginTop: spacing.xl },
});
