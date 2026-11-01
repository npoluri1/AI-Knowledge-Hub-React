import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  Linking,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { colors, spacing, baseStyles, type, radius, shadow } from "../theme/theme";

// ── State views ──────────────────────────────────────────────────────────────

export function LoadingView({ label = "Loading…" }: { label?: string }) {
  return (
    <View style={baseStyles.center}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={styles.loadingText}>{label}</Text>
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={baseStyles.center}>
      <Text style={styles.stateIcon}>⚠️</Text>
      <Text style={styles.stateTitle}>Something went wrong</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {onRetry ? (
        <Pressable style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.8 }]} onPress={onRetry}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyView({ message, icon = "🗂️" }: { message: string; icon?: string }) {
  return (
    <View style={baseStyles.center}>
      <Text style={styles.stateIcon}>{icon}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
    </View>
  );
}

// ── Headers ──────────────────────────────────────────────────────────────────

export function LargeTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[type.largeTitle, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[type.callout, { color: colors.textDim, marginTop: 4, lineHeight: 18 }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

/** Back-compat alias used by existing screens. */
export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return <LargeTitle title={title} subtitle={subtitle} />;
}

export function SectionLabel({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={baseStyles.sectionLabel}>{children}</Text>
      {action}
    </View>
  );
}

// ── Inputs ───────────────────────────────────────────────────────────────────

export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.searchWrap}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        style={styles.searchInput}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {value ? (
        <Pressable onPress={() => onChange("")} hitSlop={8}>
          <Text style={styles.searchClear}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ── Chips ────────────────────────────────────────────────────────────────────

export function Chip({
  label,
  active,
  onPress,
  count,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  count?: number;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && { opacity: 0.85 }]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
        {label}
        {typeof count === "number" ? ` · ${count}` : ""}
      </Text>
    </Pressable>
  );
}

export function ChipRow({
  items,
  activeKey,
  onSelect,
}: {
  items: { key: string; label: string; count?: number }[];
  activeKey?: string;
  onSelect?: (key: string) => void;
}) {
  if (!items.length) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: spacing.md }}
      contentContainerStyle={{ alignItems: "center", paddingRight: spacing.lg }}
    >
      {items.map((it) => (
        <Chip
          key={it.key}
          label={it.label}
          count={it.count}
          active={it.key === activeKey}
          onPress={() => onSelect?.(it.key)}
        />
      ))}
    </ScrollView>
  );
}

// ── Cards & rows ─────────────────────────────────────────────────────────────

export function Card({
  children,
  onPress,
  style,
  raised,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  raised?: boolean;
}) {
  const inner = [raised ? baseStyles.cardRaised : baseStyles.card, shadow(1), style];
  if (!onPress) return <View style={inner}>{children}</View>;
  return (
    <Pressable style={({ pressed }) => [...inner, pressed && { transform: [{ scale: 0.985 }], opacity: 0.92 }]} onPress={onPress}>
      {children}
    </Pressable>
  );
}

/** Tile with big emoji icon — used in hub grids & Home. */
export function TileCard({
  icon,
  title,
  desc,
  badge,
  onPress,
  accent,
}: {
  icon: string;
  title: string;
  desc?: string;
  badge?: string;
  onPress?: () => void;
  accent?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        shadow(1),
        pressed && { transform: [{ scale: 0.97 }], opacity: 0.92 },
      ]}
    >
      <View style={[styles.tileIconWrap, accent ? { backgroundColor: `${accent}22` } : undefined]}>
        <Text style={styles.tileIcon}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.tileTitle} numberOfLines={1}>
          {title}
          {badge ? <Text style={styles.tileBadge}>  {badge}</Text> : null}
        </Text>
        {desc ? (
          <Text style={styles.tileDesc} numberOfLines={2}>
            {desc}
          </Text>
        ) : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

/** Rich list row: icon, title, subtitle, meta line, optional link button. */
export function ListRow({
  icon,
  title,
  subtitle,
  meta,
  url,
  onPress,
}: {
  icon?: string;
  title: string;
  subtitle?: string;
  meta?: string;
  url?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress ?? (url ? () => Linking.openURL(url) : undefined)}
      style={({ pressed }) => [styles.listRow, shadow(1), pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
    >
      {icon ? (
        <View style={styles.rowIconWrap}>
          <Text style={styles.rowIcon}>{icon}</Text>
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.rowSubtitle} numberOfLines={3}>
            {subtitle}
          </Text>
        ) : null}
        {meta ? <Text style={styles.rowMeta} numberOfLines={1}>{meta}</Text> : null}
      </View>
      {url ? (
        <Pressable onPress={() => Linking.openURL(url)} hitSlop={8} style={styles.linkBtn}>
          <Text style={styles.linkBtnText}>↗</Text>
        </Pressable>
      ) : (
        <Text style={styles.chevron}>›</Text>
      )}
    </Pressable>
  );
}

// ── Stats ────────────────────────────────────────────────────────────────────

export function StatStrip({ stats }: { stats: { label: string; value: string | number; color?: string }[] }) {
  return (
    <View style={[styles.statStrip, shadow(1)]}>
      {stats.map((s, i) => (
        <View key={i} style={[styles.statCell, i > 0 && styles.statDivider]}>
          <Text style={[styles.statValue, s.color ? { color: s.color } : null]} numberOfLines={1}>
            {s.value}
          </Text>
          <Text style={styles.statLabel} numberOfLines={1}>
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ── Generic content renderer (deep item views for any catalog) ───────────────

/** Renders arrays of strings / tables / markdown-ish text found in catalog items. */
export function KeyValueBlock({ data, max }: { data: Record<string, unknown>; max?: number }) {
  const entries = Object.entries(data).slice(0, max ?? 24);
  return (
    <View style={styles.kvWrap}>
      {entries.map(([k, v]) => (
        <View key={k} style={styles.kvRow}>
          <Text style={styles.kvKey}>{k.replace(/_/g, " ")}</Text>
          <Text style={styles.kvVal}>
            {typeof v === "string" || typeof v === "number"
              ? String(v)
              : Array.isArray(v)
              ? v.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" · ")
              : v
              ? JSON.stringify(v)
              : "—"}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: { color: colors.textDim, marginTop: spacing.md, fontSize: type.callout.fontSize },
  stateIcon: { fontSize: 44, marginBottom: spacing.sm },
  stateTitle: { color: colors.text, fontSize: type.title3.fontSize, fontWeight: "700", marginBottom: 4 },
  stateMessage: { color: colors.textDim, fontSize: type.callout.fontSize, textAlign: "center", maxWidth: 300, lineHeight: 19 },
  retryBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingHorizontal: 24,
    paddingVertical: 11,
    ...shadow(2),
  },
  retryText: { color: colors.white, fontWeight: "700", fontSize: type.headline.fontSize },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadow(1),
  },
  searchIcon: { fontSize: 13, marginRight: spacing.sm, opacity: 0.7 },
  searchInput: { flex: 1, color: colors.text, fontSize: type.body.fontSize, paddingVertical: 11 },
  searchClear: { color: colors.textFaint, fontSize: 15, paddingHorizontal: 4 },
  chip: {
    backgroundColor: colors.card,
    borderColor: colors.borderSoft,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent, ...shadow(1) },
  chipText: { color: colors.textDim, fontSize: type.footnote.fontSize, fontWeight: "600" },
  chipTextActive: { color: colors.white, fontWeight: "700" },
  tile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tileIconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.sm + 2,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  tileIcon: { fontSize: 21 },
  tileTitle: { color: colors.text, fontSize: type.headline.fontSize, fontWeight: "700" },
  tileBadge: { color: colors.textFaint, fontSize: type.caption.fontSize, fontWeight: "600" },
  tileDesc: { color: colors.textDim, fontSize: type.footnote.fontSize, marginTop: 2, lineHeight: 17 },
  chevron: { color: colors.textFaint, fontSize: 22, marginLeft: spacing.sm, fontWeight: "300" },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  rowIconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  rowIcon: { fontSize: 18 },
  rowTitle: { color: colors.text, fontSize: type.headline.fontSize, fontWeight: "700", lineHeight: 20 },
  rowSubtitle: { color: colors.textDim, fontSize: type.footnote.fontSize, marginTop: 3, lineHeight: 17 },
  rowMeta: { color: colors.textFaint, fontSize: type.caption.fontSize, marginTop: 5, fontWeight: "600" },
  linkBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.xs + 2,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },
  linkBtnText: { color: colors.accent, fontSize: 15, fontWeight: "800" },
  statStrip: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  statCell: { flex: 1, alignItems: "center", paddingHorizontal: 4 },
  statDivider: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: colors.borderSoft },
  statValue: { color: colors.text, fontSize: type.title2.fontSize, fontWeight: "800" },
  statLabel: { color: colors.textFaint, fontSize: type.caption.fontSize, marginTop: 2, fontWeight: "600" },
  kvWrap: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.borderSoft, padding: spacing.md },
  kvRow: { paddingVertical: 7, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderSoft },
  kvKey: { color: colors.textFaint, fontSize: type.caption.fontSize, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6 },
  kvVal: { color: colors.text, fontSize: type.callout.fontSize, lineHeight: 19, marginTop: 2 },
});
