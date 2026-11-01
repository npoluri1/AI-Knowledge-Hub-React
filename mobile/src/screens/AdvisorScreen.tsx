import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { analyzeStock, getAdvisorNews, AdvisorAnalysis, AdvisorNewsItem, ADVISOR_NEWS_TOPICS } from "../api/api";
import { colors, baseStyles, spacing } from "../theme/theme";
import { ErrorView, ScreenHeader, ChipRow } from "../components/ui";

function clean(md: string): string {
  return md.replace(/\*\*/g, "");
}

function fmtNum(v: number | null | undefined): string {
  if (v == null) return "—";
  return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function AdvisorScreen() {
  const insets = useSafeAreaInsets();
  const [symbol, setSymbol] = useState("");
  const [activeSymbol, setActiveSymbol] = useState("");
  const [topic, setTopic] = useState("general");

  const analysisQ = useQuery({
    queryKey: ["advisor", activeSymbol],
    queryFn: () => analyzeStock(activeSymbol),
    enabled: !!activeSymbol,
    staleTime: 5 * 60_000,
  });
  const newsQ = useQuery({
    queryKey: ["advisor-news", topic],
    queryFn: () => getAdvisorNews(topic),
    staleTime: 5 * 60_000,
  });

  const runAnalysis = () => {
    const s = symbol.trim().toUpperCase();
    if (s) setActiveSymbol(s);
  };

  const analysis = analysisQ.data as AdvisorAnalysis | undefined;
  const news = newsQ.data?.news ?? [];

  const openNews = async (item: AdvisorNewsItem) => {
    if (item.url && /^https?:\/\//.test(item.url)) await Linking.openURL(item.url);
  };

  return (
    <ScrollView
      style={baseStyles.screen}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
    >
      <View style={{ paddingTop: insets.top + spacing.sm }}>
        <ScreenHeader title="🤖 Financial Advisor" subtitle="Stock analysis & market news" />
      </View>

      {/* Symbol input */}
      <View style={styles.inputRow}>
        <TextInput
          value={symbol}
          onChangeText={setSymbol}
          placeholder="Ticker e.g. AAPL, NVDA, TSLA"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          autoCapitalize="characters"
          autoCorrect={false}
          onSubmitEditing={runAnalysis}
          returnKeyType="go"
        />
        <Pressable style={styles.goBtn} onPress={runAnalysis} disabled={!symbol.trim()}>
          {analysisQ.isFetching ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.goText}>Analyze</Text>
          )}
        </Pressable>
      </View>

      {analysisQ.isError ? (
        <ErrorView message={(analysisQ.error as Error).message} onRetry={() => analysisQ.refetch()} />
      ) : null}

      {analysis?.error ? <Text style={styles.errText}>⚠️ {analysis.error}</Text> : null}

      {/* Quick stats */}
      {analysis?.quickStats ? (
        <View style={baseStyles.card}>
          <Text style={baseStyles.title}>
            {analysis.name || activeSymbol} ({activeSymbol})
          </Text>
          <View style={styles.statsGrid}>
            <StatCell label="Price" value={`$${fmtNum(analysis.quickStats.price)}`} />
            <StatCell
              label="Change"
              value={analysis.quickStats.changePct != null ? `${analysis.quickStats.changePct >= 0 ? "+" : ""}${analysis.quickStats.changePct.toFixed(2)}%` : "—"}
              color={analysis.quickStats.changePct != null ? (analysis.quickStats.changePct >= 0 ? colors.green : colors.red) : undefined}
            />
            <StatCell label="Market Cap" value={analysis.quickStats.marketCap ?? "—"} />
            <StatCell label="P/E" value={fmtNum(analysis.quickStats.pe)} />
            <StatCell label="Div Yield" value={analysis.quickStats.dividendYield ?? "—"} />
            <StatCell label="Beta" value={fmtNum(analysis.quickStats.beta)} />
            <StatCell label="52W High" value={fmtNum(analysis.quickStats.week52High)} />
            <StatCell label="52W Low" value={fmtNum(analysis.quickStats.week52Low)} />
          </View>
          {analysis.quickStats.score != null ? (
            <View style={styles.verdictBox}>
              <Text style={styles.scoreText}>Score: {analysis.quickStats.score}/100</Text>
              <Text style={styles.verdictText}>{clean(analysis.quickStats.verdict ?? "")}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Analysis sections */}
      {analysis?.sections?.map((sec, i) => (
        <View key={i} style={baseStyles.card}>
          <Text style={styles.sectionTitle}>{sec.title}</Text>
          {sec.facts.slice(0, 12).map((f, j) => (
            <Text key={j} style={styles.fact}>{clean(f)}</Text>
          ))}
        </View>
      ))}

      {/* Market news */}
      <Text style={styles.groupTitle}>📰 Market News</Text>
      <ChipRow
        items={ADVISOR_NEWS_TOPICS.map((t) => ({ key: t.key, label: t.label }))}
        activeKey={topic}
        onSelect={(k) => setTopic(k)}
      />
      {newsQ.isLoading ? <ActivityIndicator color={colors.accent} style={{ marginVertical: spacing.lg }} /> : null}
      {newsQ.isError ? <Text style={styles.errText}>News error: {(newsQ.error as Error).message}</Text> : null}
      {news.map((n, i) => (
        <Pressable key={`${n.title}-${i}`} style={baseStyles.card} onPress={() => openNews(n)}>
          <Text style={styles.newsPublisher}>{n.publisher || n.symbol}</Text>
          <Text style={baseStyles.title}>{n.title}</Text>
          {n.publishedAt ? (
            <Text style={baseStyles.faint}>
              {typeof n.publishedAt === "number"
                ? new Date(n.publishedAt * 1000).toISOString().slice(0, 10)
                : String(n.publishedAt).slice(0, 10)}
            </Text>
          ) : null}
        </Pressable>
      ))}
      {!newsQ.isLoading && !news.length ? (
        <Text style={styles.empty}>No news for this topic.</Text>
      ) : null}
    </ScrollView>
  );
}

function StatCell({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, color ? { color } : null]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: spacing.md,
    fontSize: 15,
  },
  goBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  goText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: spacing.md },
  statCell: { width: "50%", paddingVertical: spacing.sm },
  statLabel: { color: colors.textFaint, fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  statValue: { color: colors.text, fontSize: 15, fontWeight: "800", marginTop: 2 },
  verdictBox: {
    backgroundColor: colors.accentSoft,
    borderRadius: 10,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  scoreText: { color: colors.accent, fontWeight: "800", fontSize: 15 },
  verdictText: { color: colors.text, fontSize: 13, marginTop: 4, lineHeight: 19 },
  sectionTitle: { color: colors.accent, fontSize: 15, fontWeight: "800", marginBottom: spacing.sm },
  fact: { color: colors.textDim, fontSize: 13, lineHeight: 20, marginBottom: 4 },
  groupTitle: {
    color: colors.textFaint,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  newsPublisher: { color: colors.accent, fontSize: 11, fontWeight: "800", letterSpacing: 0.5, marginBottom: 4 },
  errText: { color: colors.red, fontSize: 13, marginBottom: spacing.md },
  empty: { color: colors.textDim, textAlign: "center", marginVertical: spacing.lg },
});
