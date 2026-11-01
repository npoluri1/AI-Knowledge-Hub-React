/**
 * iOS-grade design system for AI Knowledge Hub mobile.
 *
 * Design language: iOS depth + the web app's dark neon aesthetic.
 *  - Layered surfaces (#0b1020 canvas -> raised cards -> floating chrome)
 *  - Soft multi-layer shadows, hairline strokes, generous radii
 *  - SF-style typographic scale (largeTitle -> title2 -> headline -> body…)
 *  - Accent gradient (indigo -> violet) used sparingly for heroes / CTAs
 *  - One visual language on Android and iOS (same components, same metrics)
 */

import { Platform, StatusBar, StyleSheet } from "react-native";

export const colors = {
  bg: "#0b1020",
  bgElevated: "#0e1430",
  card: "#131a30",
  cardAlt: "#1a2340",
  cardHover: "#1e2a4d",
  border: "#25305a",
  borderSoft: "rgba(139,147,184,0.18)",
  text: "#e8ecff",
  textDim: "#8b93b8",
  textFaint: "#5a628a",
  accent: "#6c8cff",
  accent2: "#8f6cff",
  accentSoft: "rgba(108,140,255,0.15)",
  accentGlow: "rgba(108,140,255,0.35)",
  green: "#3ddc84",
  red: "#ff5d73",
  amber: "#ffb454",
  teal: "#2dd4bf",
  pink: "#f472b6",
  tabActive: "#8fa8ff",
  tabInactive: "#5a628a",
  headerBg: "rgba(11,16,32,0.92)",
  white: "#ffffff",
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };
export const radius = { xs: 8, sm: 10, md: 14, lg: 18, xl: 24, pill: 999 };

// SF-style typographic scale
export const type = {
  largeTitle: { fontSize: 30, fontWeight: "800", letterSpacing: 0.2 },
  title1: { fontSize: 24, fontWeight: "800" },
  title2: { fontSize: 19, fontWeight: "700" },
  title3: { fontSize: 16, fontWeight: "700" },
  headline: { fontSize: 15, fontWeight: "600" },
  body: { fontSize: 14, fontWeight: "400" },
  callout: { fontSize: 13, fontWeight: "400" },
  footnote: { fontSize: 12, fontWeight: "400" },
  caption: { fontSize: 11, fontWeight: "500" },
} as const;

const isIOS = Platform.OS === "ios";

/** Soft layered shadow used for raised cards & floating chrome. */
export const shadow = (level: 1 | 2 | 3 = 1) =>
  Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: level === 1 ? 4 : level === 2 ? 10 : 18 },
      shadowOpacity: level === 1 ? 0.18 : level === 2 ? 0.3 : 0.4,
      shadowRadius: level === 1 ? 8 : level === 2 ? 20 : 30,
    },
    android: { elevation: level === 1 ? 3 : level === 2 ? 8 : 14 },
    default: {},
  }) as unknown as import("react-native").ViewStyle;

export const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardRaised: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  title: { color: colors.text, fontSize: type.title2.fontSize, fontWeight: "700" },
  subtitle: { color: colors.textDim, fontSize: type.callout.fontSize, marginTop: 2, lineHeight: 18 },
  body: { color: colors.text, fontSize: type.body.fontSize, lineHeight: 21 },
  dim: { color: colors.textDim, fontSize: type.footnote.fontSize },
  faint: { color: colors.textFaint, fontSize: type.caption.fontSize },
  row: { flexDirection: "row", alignItems: "center" },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  pillText: { color: colors.accent, fontSize: type.caption.fontSize, fontWeight: "600" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  sectionLabel: {
    color: colors.textFaint,
    fontSize: type.caption.fontSize,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
});

export function applyStatusBar() {
  StatusBar.setBarStyle("light-content", true);
}
