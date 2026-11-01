import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, type, radius } from "../theme/theme";

// ── Markdown-ish renderer ────────────────────────────────────────────────────

type Block =
  | { type: "h1" | "h2" | "h3" | "p"; text: string }
  | { type: "code"; text: string; lang?: string }
  | { type: "li"; text: string }
  | { type: "ol"; text: string; num: number };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let codeLang: string | undefined;

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: "p", text: para.join(" ").trim() });
      para = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim().startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "code", text: codeLines.join("\n"), lang: codeLang });
        inCode = false;
        codeLines = [];
        codeLang = undefined;
      } else {
        flushPara();
        inCode = true;
        codeLang = line.trim().slice(3).trim() || undefined;
      }
      continue;
    }
    if (inCode) {
      codeLines.push(raw);
      continue;
    }
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      flushPara();
      const level = h[1].length;
      blocks.push({ type: level === 1 ? "h1" : level === 2 ? "h2" : "h3", text: h[2].trim() });
      continue;
    }
    const li = line.match(/^\s*[-*•]\s+(.*)$/);
    if (li) {
      flushPara();
      blocks.push({ type: "li", text: li[1].trim() });
      continue;
    }
    const ol = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (ol) {
      flushPara();
      blocks.push({ type: "ol", text: ol[2].trim(), num: parseInt(ol[1], 10) });
      continue;
    }
    if (!line.trim()) {
      flushPara();
      continue;
    }
    para.push(line.trim());
  }
  if (inCode && codeLines.length) blocks.push({ type: "code", text: codeLines.join("\n"), lang: codeLang });
  flushPara();
  return blocks;
}

/** Inline **bold** and `code` spans. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**"))
          return <Text key={i} style={styles.strong}>{p.slice(2, -2)}</Text>;
        if (p.startsWith("`") && p.endsWith("`"))
          return <Text key={i} style={styles.inlineCode}>{p.slice(1, -1)}</Text>;
        return <Text key={i}>{p}</Text>;
      })}
    </>
  );
}

export function Markdownish({ text, style }: { text: string; style?: object | undefined }) {
  const blocks = React.useMemo(() => parseBlocks(text), [text]);
  return (
    <View style={style}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h1":
            return (
              <Text key={i} style={styles.mdH1}>
                <Inline text={b.text} />
              </Text>
            );
          case "h2":
            return (
              <Text key={i} style={styles.mdH2}>
                <Inline text={b.text} />
              </Text>
            );
          case "h3":
            return (
              <Text key={i} style={styles.mdH3}>
                <Inline text={b.text} />
              </Text>
            );
          case "code":
            return (
              <View key={i} style={styles.codeBlock}>
                {b.lang ? <Text style={styles.codeLang}>{b.lang}</Text> : null}
                <Text style={styles.codeText} selectable>
                  {b.text}
                </Text>
              </View>
            );
          case "li":
            return (
              <View key={i} style={styles.liRow}>
                <Text style={styles.liBullet}>•</Text>
                <Text style={styles.liText}>
                  <Inline text={b.text} />
                </Text>
              </View>
            );
          case "ol":
            return (
              <View key={i} style={styles.liRow}>
                <Text style={styles.liBullet}>{b.num}.</Text>
                <Text style={styles.liText}>
                  <Inline text={b.text} />
                </Text>
              </View>
            );
          case "p":
          default:
            return (
              <Text key={i} style={styles.mdP}>
                <Inline text={b.text} />
              </Text>
            );
        }
      })}
    </View>
  );
}

// ── Rows-as-cards renderer (Knowledge-Base style tables) ─────────────────────

export function RowsBlock({ rows, headers }: { rows: Record<string, unknown>[]; headers?: string[] }) {
  if (!rows?.length) return null;
  return (
    <View>
      {rows.map((r, i) => {
        const title =
          (typeof r.topic === "string" && r.topic) ||
          (typeof r.name === "string" && r.name) ||
          (typeof r.title === "string" && r.title) ||
          (typeof r.label === "string" && r.label) ||
          (typeof r.tool === "string" && r.tool) ||
          (typeof r.step === "string" && r.step) ||
          `Row ${i + 1}`;
        const detail =
          (typeof r.detail === "string" && r.detail) ||
          (typeof r.description === "string" && r.description) ||
          (typeof r.text === "string" && r.text) ||
          (typeof r.desc === "string" && r.desc) ||
          (typeof r.why === "string" && r.why) ||
          (typeof r.value === "string" && r.value) ||
          "";
        return (
          <View key={i} style={styles.rowCard}>
            <Text style={styles.rowCardTitle}>{title}</Text>
            {detail ? <Text style={styles.rowCardText}>{detail}</Text> : null}
            {Object.entries(r)
              .filter(
                ([k, v]) =>
                  !["topic", "name", "title", "detail", "description", "text", "desc", "why", "value", "label", "tool", "step"].includes(k) &&
                  (typeof v === "string" || typeof v === "number")
              )
              .map(([k, v]) => (
                <Text key={k} style={styles.rowCardMeta}>
                  {k.replace(/_/g, " ")}: {String(v)}
                </Text>
              ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  mdH1: { color: colors.text, fontSize: 20, fontWeight: "800", marginTop: spacing.md, marginBottom: spacing.sm, lineHeight: 26 },
  mdH2: { color: colors.text, fontSize: 17, fontWeight: "800", marginTop: spacing.md, marginBottom: 6, lineHeight: 23 },
  mdH3: { color: colors.accent, fontSize: 14, fontWeight: "700", marginTop: spacing.md, marginBottom: 4 },
  mdP: { color: colors.text, fontSize: type.body.fontSize, lineHeight: 21, marginBottom: 8 },
  strong: { fontWeight: "800", color: colors.text },
  inlineCode: { fontFamily: undefined, color: colors.accent, backgroundColor: colors.accentSoft, fontSize: 12.5 },
  codeBlock: {
    backgroundColor: "#0a0f1f",
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  codeLang: { color: colors.textFaint, fontSize: 10, fontWeight: "800", textTransform: "uppercase", marginBottom: 4, letterSpacing: 0.8 },
  codeText: { color: "#9ecbff", fontSize: 11.5, lineHeight: 17 },
  liRow: { flexDirection: "row", marginBottom: 5, paddingRight: 4 },
  liBullet: { color: colors.accent, fontWeight: "800", marginRight: 7 },
  liText: { color: colors.text, fontSize: type.body.fontSize, lineHeight: 20, flex: 1 },
  rowCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  rowCardTitle: { color: colors.accent, fontSize: type.headline.fontSize, fontWeight: "700", marginBottom: 4 },
  rowCardText: { color: colors.text, fontSize: type.callout.fontSize, lineHeight: 19 },
  rowCardMeta: { color: colors.textFaint, fontSize: type.caption.fontSize, marginTop: 4 },
});
