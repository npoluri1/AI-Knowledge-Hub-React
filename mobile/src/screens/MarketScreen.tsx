import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getIndices, getPopularQuotes, Quote } from "../api/api";
import { colors, baseStyles, spacing } from "../theme/theme";
import { LoadingView, ErrorView, ScreenHeader, ChipRow } from "../components/ui";

const REGIONS = [
  { key: "indices", label: "🌐 Global Indices" },
  { key: "US", label: "🇺🇸 US" },
  { key: "IN", label: "🇮🇳 India" },
  { key: "GB", label: "🇬🇧 UK" },
  { key: "JP", label: "🇯🇵 Japan" },
  { key: "SG", label: "🇸🇬 Singapore" },
  { key: "HK", label: "🇭🇰 Hong Kong" },
  { key: "KR", label: "🇰🇷 Korea" },
  { key: "AU", label: "🇦🇺 Australia" },
  { key: "EU", label: "🇪🇺 EU" },
  { key: "Crypto", label: "₿ Crypto" },
];

function priceColor(pct: number | null | undefined) {
  if (pct == null) return colors.textDim;
  return pct >= 0 ? colors.green : colors.red;
}

function fmtPct(pct: number | null | undefined) {
  if (pct == null) return "—";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

function fmtPrice(p: number | null | undefined) {
  if (p == null) return "—";
  return p.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const [region, setRegion] = useState("indices");
  const [search, setSearch] = useState("");

  const indicesQ = useQuery({
    queryKey: ["indices"],
    queryFn: getIndices,
    staleTime: 60_000,
    enabled: region === "indices",
  });
  const popularQ = useQuery({
    queryKey: ["popular", region],
    queryFn: () => getPopularQuotes(region),
    staleTime: 60_000,
    enabled: region !== "indices",
  });

  const quotes: Quote[] = useMemo(() => {
    if (region === "indices") return indicesQ.data?.indices ?? [];
    const list = popularQ.data?.quotes ?? [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (it) =>
        it.symbol?.toLowerCase().includes(q) || it.name?.toLowerCase().includes(q)
    );
  }, [region, indicesQ.data, popularQ.data, search]);

  const loading = region === "indices" ? indicesQ.isLoading : popularQ.isLoading;
  const error = region === "indices" ? indicesQ.error : popularQ.error;
  const refetch = region === "indices" ? indicesQ.refetch : popularQ.refetch;

  if (loading) return <LoadingView label="Fetching live quotes…" />;
  if (error)
    return <ErrorView message={(error as Error).message} onRetry={() => refetch()} />;

  return (
    <View style={baseStyles.screen}>
      <FlatList
        data={quotes}
        keyExtractor={(item, i) => `${item.symbol}-${i}`}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => refetch()}
            tintColor={colors.accent}
          />
        }
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + spacing.sm, marginBottom: spacing.md }}>
            <ScreenHeader title="📈 Market" subtitle="Live data via yfinance on your backend" />
            <ChipRow items={REGIONS} activeKey={region} onSelect={setRegion} />
            {region !== "indices" ? (
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Filter symbol or name…"
                placeholderTextColor={colors.textFaint}
                style={styles.search}
              />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No quotes returned for this region.</Text>
        }
        renderItem={({ item }) => (
          <View style={baseStyles.card}>
            <View style={baseStyles.row}>
              <View style={{ flex: 1, marginRight: spacing.md }}>
                <Text style={baseStyles.title} numberOfLines={1}>
                  {item.name || item.symbol}
                </Text>
                <Text style={baseStyles.faint}>
                  {item.symbol}
                  {item.indexCountry ? ` · ${item.indexCountry}` : ""}
                  {item.currency ? ` · ${item.currency}` : ""}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.price}>{fmtPrice(item.price)}</Text>
                <Text style={[styles.pct, { color: priceColor(item.changePct) }]}>
                  {fmtPct(item.changePct)}
                </Text>
              </View>
            </View>
            {item.error ? <Text style={styles.err}>⚠️ {item.error}</Text> : null}
          </View>
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
  },
  price: { color: colors.text, fontSize: 17, fontWeight: "800" },
  pct: { fontSize: 13, fontWeight: "700", marginTop: 2 },
  err: { color: colors.amber, fontSize: 12, marginTop: spacing.sm },
  empty: { color: colors.textDim, textAlign: "center", marginTop: spacing.xl },
});
