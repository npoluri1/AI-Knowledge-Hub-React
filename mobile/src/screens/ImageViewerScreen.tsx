import React from "react";
import { View, Text, Image, Pressable, StyleSheet, ScrollView } from "react-native";
import { colors, spacing } from "../theme/theme";

export default function ImageViewerScreen({ route, navigation }: any) {
  const { url, title } = route.params;
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {title ?? "Image"}
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView maximumZoomScale={4} minimumZoomScale={1} contentContainerStyle={styles.center}>
        <Image source={{ uri: url }} style={styles.image} resizeMode="contain" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 46,
    paddingBottom: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  backText: { color: "#fff", fontSize: 30, fontWeight: "300", marginTop: -4 },
  title: { flex: 1, color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" },
  center: { flexGrow: 1, alignItems: "center", justifyContent: "center" },
  image: { width: "100%", aspectRatio: 1 },
});
