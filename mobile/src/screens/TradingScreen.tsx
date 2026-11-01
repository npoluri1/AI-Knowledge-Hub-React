import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDailyTrading, getLiveInvestments, Quote } from "../api/api";
import { colors, baseStyles, spacing } from "../theme/theme";
import { LoadingView, ErrorView, ScreenHeader, ChipRow } from "../components/ui";

interface DailyTrading {
  gainers: Quote[];
  losers: Quote[];
  mostActive: Quote[];
  sectors: { name: string; avgChange: number; stockCount: number; topStock: string }[];
  marketBreadth: { up: number; down: number; flat: number; total: number; avgChange: number };
  sentiment: { label: string; emoji: string; avgChange: number };
  fetchedAt?: string;
}

const PICK_CATEGORIES = [
  { key: "all", label: "🌐 All Picks" },
  { key: "stocks-us", label: "🇺🇸 US Stocks" },
  { key: "stocks-in", label: "🇮🇳 India" },
  { key: "stocks-sg", label: "🇸🇬 Singapore" },
  { key: "stocks-hk", label: "🇭🇰 HK" },
  { key: "etfs", label: "📊 ETFs" },
  { key: "crypto", label: "₿ Crypto" },
  { key: "commodities", label: "🪙 Commodities" },
  { key: "forex", label: "💱 Forex" },
];

type Tab = "movers" | "picks";

function fmtPct(p: number | null | undefined) {
  if (p == null) return "—";
  return `${p >= 0 ? "+" : ""}${p.toFixed(2)}%`;
}
function pctColor(p: number | null | undefined) {
  if (p == null) return colors.textDim;
  return p >= 0 ? colors.green : colors.red;
}

function QuoteRow({ q }: { q: Quote }) {
  return (
    <View style={styles.quoteRow}>
      <View style={{ flex: 1, marginRight: spacing.md }}>
        <Text style={styles.quoteName} numberOfLines={1}>{q.name || q.symbol}</Text>
        <Text style={baseStyles.faint} numberOfLines={1}>
          {q.symbol}{q.indexCountry ? ` · ${q.indexCountry}` : ""}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.quotePrice}>
          {q.price != null ? q.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
        </Text>
        <Text style={[styles.quotePct, { color: pctColor(q.changePct) }]}>{fmtPct(q.changePct)}</Text>
      </View>
    </View>
  );
}

function QuoteMini({ q }: { q: Quote }) {
  return (
    <View style={styles.quoteMini}>
      <Text style={styles.miniSymbol} numberOfLines={1}>{q.symbol}</Text>
      <Text style={styles.miniPrice}>
        {q.price != null ? q.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
      </Text>
      <Text style={[styles.miniPct, { color: pctColor(q.changePct) }]}>{fmtPct(q.changePct)}</Text>
    </View>
  );
}

export default function TradingScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("movers");
  const [pickCat, setPickCat] = useState("all");

  const dailyQ = useQuery({
    queryKey: ["daily-trading"],
    queryFn: getDailyTrading,
    staleTime: 5 * 60_000,
    enabled: tab === "movers",
  });
  const picksQ = useQuery({
    queryKey: ["live-investments", pickCat],
    queryFn: () => getLiveInvestments(pickCat),
    staleTime: 5 * 60_000,
    enabled: tab === "picks",
  });

  const daily = dailyQ.data as DailyTrading | undefined;
  const picks = picksQ.data as import("../api/api").LiveInvestmentsAll | import("../api/api").LiveInvestmentsCategory | undefined;

  const pickItems: { category: string; title: string; items: Quote[] }[] =
    picks && "categories" in picks
      ? picks.categories
      : picks
        ? [{ category: picks.category, title: picks.title, items: picks.items }]
        : [];

  const loading = tab === "movers" ? dailyQ.isLoading : picksQ.isLoading;
  const error = tab === "movers" ? dailyQ.error : picksQ.error;
  const refetch = tab === "movers" ? dailyQ.refetch : picksQ.refetch;

  if (loading) return <LoadingView label="Fetching market data…" />;
  if (error) return <ErrorView message={(error as Error).message} onRetry={() => refetch()} />;

  return (
    <View style={baseStyles.screen}>
      <FlatList
        data={tab === "movers" ? [] : pickItems}
        keyExtractor={(c, i) => `${c.category}-${i}`}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => refetch()} tintColor={colors.accent} />
        }
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + spacing.sm }}>
            <ScreenHeader title="📊 Trading Desk" subtitle="Live via yfinance on your backend" />
            <View style={styles.tabs}>
              {([["movers", "🔥 Movers"], ["picks", "💎 Live Picks"]] as const).map(([k, label]) => (
                <PressableTab key={k} label={label} active={tab === k} onPress={() => setTab(k)} />
              ))}
            </View>
            {tab === "picks" ? (
              <ChipRow items={PICK_CATEGORIES} activeKey={pickCat} onSelect={setPickCat} />
            ) : null}
          </View>
        }
        renderItem={({ item }) =>
          tab === "picks" ? (
            <View style={baseStyles.card}>
              <Text style={styles.groupTitle}>{item.title}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {item.items.slice(0, 10).map((q, i) => (
                  <QuoteMini key={`${q.symbol}-${i}`} q={q} />
                ))}
              </ScrollView>
            </View>
          ) : null
        }
        ListFooterComponent={
          tab === "movers" && daily ? (
            <View>
              {/* Sentiment + breadth */}
              <View style={baseStyles.card}>
                <View style={baseStyles.row}>
                  <Text style={{ fontSize: 26, marginRight: spacing.md }}>{daily.sentiment?.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={baseStyles.title}>{daily.sentiment?.label} market</Text>
                    <Text style={baseStyles.faint}>
                      Breadth: 🟢 {daily.marketBreadth?.up ?? 0} up · 🔴 {daily.marketBreadth?.down ?? 0} down ·
                      ⚪ {daily.marketBreadth?.flat ?? 0} flat (of {daily.marketBreadth?.total ?? 0})
                    </Text>
                  </View>
                </View>
              </View>

              {/* Gainers */}
              <Text style={styles.groupTitle}>🚀 Top Gainers</Text>
              <View style={baseStyles.card}>
                {(daily.gainers ?? []).slice(0, 10).map((q, i) => (
                  <QuoteRow key={`g-${q.symbol}-${i}`} q={q} />
                ))}
              </View>

              {/* Losers */}
              <Text style={styles.groupTitle}>📉 Top Losers</Text>
              <View style={baseStyles.card}>
                {(daily.losers ?? []).slice(0, 10).map((q, i) => (
                  <QuoteRow key={`l-${q.symbol}-${i}`} q={q} />
                ))}
              </View>

              {/* Most active */}
              <Text style={styles.groupTitle}>⚡ Most Active</Text>
              <View style={baseStyles.card}>
                {(daily.mostActive ?? []).slice(0, 10).map((q, i) => (
                  <QuoteRow key={`a-${q.symbol}-${i}`} q={q} />
                ))}
              </View>

              {/* Sectors */}
              <Text style={styles.groupTitle}>🏭 Sector Performance</Text>
              <View style={baseStyles.card}>
                {(daily.sectors ?? []).slice(0, 10).map((s, i) => (
                  <View key={`${s.name}-${i}`} style={styles.sectorRow}>
                    <Text style={[baseStyles.body, { flex: 1 }]} numberOfLines={1}>{s.name}</Text>
                    <Text style={[styles.sectorPct, { color: pctColor(s.avgChange) }]}>{fmtPct(s.avgChange)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.empty}>No data available.</Text>
          )
        }
      />
    </View>
  );
}

function PressableTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
      accessibilityRole="button"
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: "row", gap: spacing.sm, marginVertical: spacing.md },
  tab: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  tabText: { color: colors.textDim, fontWeight: "700", fontSize: 14 },
  tabTextActive: { color: "#fff" },
  groupTitle: {
    color: colors.textFaint,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  quoteRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  quoteName: { color: colors.text, fontSize: 14, fontWeight: "700" },
  quotePrice: { color: colors.text, fontSize: 14, fontWeight: "800" },
  quotePct: { fontSize: 12, fontWeight: "700", marginTop: 2 },
  quoteMini: {
    width: 110,
    backgroundColor: colors.cardAlt,
    borderRadius: 10,
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  miniSymbol: { color: colors.accent, fontSize: 11, fontWeight: "800" },
  miniPrice: { color: colors.text, fontSize: 13, fontWeight: "800", marginTop: 2 },
  miniPct: { fontSize: 11, fontWeight: "700", marginTop: 1 },
  sectorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  sectorPct: { fontSize: 13, fontWeight: "800" },
  empty: { color: colors.textDim, textAlign: "center", marginTop: spacing.xl },
});
