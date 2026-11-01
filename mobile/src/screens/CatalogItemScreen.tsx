import React from "react";
import { ScrollView, View, Text, Linking, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getApiBaseUrl } from "../api/client";
import { colors, spacing, type, radius } from "../theme/theme";
import {
  Card,
  EmptyView,
  ErrorView,
  LargeTitle,
  LoadingView,
  KeyValueBlock,
  SectionLabel,
} from "../components/ui";
import { Markdownish, RowsBlock } from "../components/RichContent";

export type CatalogItemParams = {
  catalogKey: string;
  idx?: number;
  id: string;
  title: string;
  item?: Record<string, unknown>;
};

function isPrimitive(v: unknown): v is string | number | boolean {
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean";
}

/** Render a {headers, rows} table. */
function TableBlock({ table }: { table: { headers: string[]; rows: unknown[][] } }) {
  const rows = table?.rows ?? [];
  if (!rows.length) return null;
  const headers = table?.headers ?? [];
  const first = rows[0];
  const isRowObjects = first && typeof first === "object" && !Array.isArray(first);
  if (isRowObjects) return <RowsBlock rows={rows as unknown as Record<string, unknown>[]} />;
  return (
    <View style={styles.tableWrap}>
      <View style={[styles.tableRow, styles.tableHead]}>
        {headers.map((h, i) => (
          <Text key={i} style={[styles.tableHeadCell]} numberOfLines={1}>
            {h}
          </Text>
        ))}
      </View>
      {rows.slice(0, 50).map((row, ri) => (
        <View key={ri} style={styles.tableRow}>
          {(Array.isArray(row) ? row : [row]).map((cell, ci) => (
            <Text key={ci} style={styles.tableCell} numberOfLines={4}>
              {typeof cell === "string" ? cell : JSON.stringify(cell)}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

/** One content section (heading + text/callouts/code/table). */
function SectionBlock({ section }: { section: Record<string, unknown> }) {
  const heading = typeof section.heading === "string" ? section.heading : undefined;
  return (
    <Card style={{ marginBottom: spacing.md }}>
      {heading ? <Text style={styles.sectionHeading}>{heading}</Text> : null}
      {typeof section.text === "string" ? (
        <Markdownish text={section.text} />
      ) : null}
      {typeof section.concept === "string" ? <Callout icon="💡" label="Concept" text={section.concept} /> : null}
      {typeof section.scenario === "string" ? <Callout icon="🎯" label="Scenario" text={section.scenario} /> : null}
      {typeof section.warning === "string" ? <Callout icon="⚠️" label="Warning" text={section.warning} tone="red" /> : null}
      {typeof section.insight === "string" ? <Callout icon="✨" label="Insight" text={section.insight} /> : null}
      {section.table && typeof section.table === "object" ? <TableBlock table={section.table as any} /> : null}
      {Array.isArray(section.list)
        ? (section.list as unknown[]).map((li, i) => (
            <Text key={i} style={styles.bullet}>
              • {typeof li === "string" ? li : JSON.stringify(li)}
            </Text>
          ))
        : null}
      {section.code && typeof section.code === "object" ? (
        <View style={styles.codeBlock}>
          {typeof (section.code as any).title === "string" ? (
            <Text style={styles.codeTitle}>{(section.code as any).title}</Text>
          ) : null}
          <Text style={styles.codeText} selectable>
            {String((section.code as any).content ?? JSON.stringify(section.code, null, 1))}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

function Callout({ icon, label, text, tone }: { icon: string; label: string; text: string; tone?: "red" }) {
  return (
    <View style={[styles.callout, tone === "red" && styles.calloutRed]}>
      <Text style={[styles.calloutLabel, tone === "red" && { color: colors.red }]}>
        {icon} {label}
      </Text>
      <Text style={styles.calloutText}>{text}</Text>
    </View>
  );
}

export default function CatalogItemScreen({ route, navigation }: any) {
  const { catalogKey, id, title }: CatalogItemParams = route.params;

  const singleQ = useQuery({
    queryKey: ["catalog-single", catalogKey, id],
    queryFn: () =>
      fetch(
        `${getApiBaseUrl()}/api/catalog/${encodeURIComponent(catalogKey)}/item/${encodeURIComponent(id)}`
      )
        .then((r) => r.json())
        .then((j) => j.item ?? j),
    enabled: !route.params?.item,
  });

  React.useEffect(() => {
    navigation?.setOptions?.({ title: title ?? "Detail" });
  }, [title]);

  const item: Record<string, unknown> | undefined = route.params?.item ?? singleQ.data;

  if (!item) return <LoadingView label="Loading detail…" />;
  if (singleQ.isError && !route.params?.item)
    return <ErrorView message={String((singleQ.error as Error)?.message)} />;

  // ── Classify the item's fields ──
  const scalars: Record<string, unknown> = {};
  const listOfScalars: { key: string; items: string[] }[] = [];
  const sections: Record<string, unknown>[] = [];
  const longStrings: string[] = [];
  let table: any = null;
  const IGNORED = new Set(["id", "idx", "icon", "color", "url", "link", "slug", "file", "group"]);

  for (const [k, v] of Object.entries(item)) {
    if (IGNORED.has(k)) continue;
    if (isPrimitive(v) && String(v).length < 400 && k !== "content" && k !== "markdown" && k !== "body") {
      scalars[k] = v;
    } else if (Array.isArray(v) && v.length && v.every(isPrimitive) && k !== "sections") {
      listOfScalars.push({ key: k, items: v.map(String) });
    } else if (Array.isArray(v) && v.length && typeof v[0] === "object") {
      // array of objects: rows-like (small keyed, no heading) -> RowsBlock;
      // heading sections -> SectionBlock.
      const first = v[0] as Record<string, unknown>;
      const rowsLike =
        "topic" in first ||
        "detail" in first ||
        (Object.keys(first).length <= 6 && !("heading" in first) && !("content" in first));
      if (rowsLike) sections.push({ __rows: v });
      else sections.push(...(v as Record<string, unknown>[]).slice(0, 12));
    } else if (v && typeof v === "object") {
      const obj = v as Record<string, unknown>;
      if (Array.isArray(obj.headers) && Array.isArray(obj.rows)) table = obj;
      else if ("content" in obj && typeof obj.content === "string") sections.push({ __code: obj });
      else sections.push(obj);
    } else if (typeof v === "string" && v.length >= 400) {
      longStrings.push(v);
    }
  }

  const url = typeof item.url === "string" ? item.url : typeof item.link === "string" ? (item.link as string) : undefined;
  const markdownish = longStrings.length > 0 || sections.some((s) => typeof s.content === "string" && (s.content as string).length > 200);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
      <LargeTitle title={title} subtitle={typeof item.subtitle === "string" ? (item.subtitle as string) : undefined} />

      {url ? (
        <Card onPress={() => Linking.openURL(url)} raised>
          <Text style={styles.linkCard}>🌐 Open external link</Text>
          <Text style={styles.linkUrl} numberOfLines={1}>
            {url}
          </Text>
        </Card>
      ) : null}

      {Object.keys(scalars).length ? (
        <>
          <SectionLabel>Details</SectionLabel>
          <KeyValueBlock data={scalars} max={14} />
        </>
      ) : null}

      {listOfScalars.map(({ key, items }) => (
        <View key={key}>
          <SectionLabel>{key.replace(/_/g, " ")}</SectionLabel>
          <Card>
            {items.map((li, i) => (
              <Text key={i} style={styles.bullet}>
                • {li}
              </Text>
            ))}
          </Card>
        </View>
      ))}

      {table ? (
        <>
          <SectionLabel>Table</SectionLabel>
          <TableBlock table={table} />
        </>
      ) : null}

      {longStrings.map((s, i) => (
        <Card key={i}>
          <Markdownish text={s} />
        </Card>
      ))}

      {sections.map((s, i) =>
        "__rows" in s ? (
          <View key={i}>
            <SectionLabel>Details</SectionLabel>
            <RowsBlock rows={s.__rows as Record<string, unknown>[]} />
          </View>
        ) : "__code" in s ? (
          <View key={i} style={styles.codeBlock}>
            {typeof (s.__code as any).title === "string" ? (
              <Text style={styles.codeTitle}>{(s.__code as any).title}</Text>
            ) : null}
            <Text style={styles.codeText} selectable>
              {(s.__code as any).content}
            </Text>
          </View>
        ) : (
          <SectionBlock key={i} section={s} />
        )
      )}

      {!Object.keys(scalarKeys(scalars)).length &&
      !listOfScalars.length &&
      !sections.length &&
      !longStrings.length &&
      !table ? (
        <EmptyView message="No renderable content in this item" />
      ) : null}
    </ScrollView>
  );
}

function scalarKeys(o: Record<string, unknown>) {
  return Object.keys(o);
}

const styles = StyleSheet.create({
  linkCard: { color: colors.accent, fontSize: type.headline.fontSize, fontWeight: "700" },
  linkUrl: { color: colors.textFaint, fontSize: type.footnote.fontSize, marginTop: 3 },
  sectionHeading: { color: colors.text, fontSize: type.title3.fontSize, fontWeight: "800", marginBottom: spacing.sm, lineHeight: 22 },
  callout: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(108,140,255,0.35)",
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  calloutRed: { backgroundColor: "rgba(255,93,115,0.12)", borderColor: "rgba(255,93,115,0.4)" },
  calloutLabel: { color: colors.accent, fontSize: type.caption.fontSize, fontWeight: "800", marginBottom: 3 },
  calloutText: { color: colors.text, fontSize: type.callout.fontSize, lineHeight: 19 },
  bullet: { color: colors.text, fontSize: type.callout.fontSize, lineHeight: 21, marginBottom: 4 },
  codeBlock: {
    backgroundColor: "#0a0f1f",
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  codeTitle: { color: colors.accent, fontSize: type.footnote.fontSize, fontWeight: "700", marginBottom: 6 },
  codeText: { color: "#9ecbff", fontSize: 11.5, lineHeight: 17 },
  tableWrap: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    overflow: "hidden",
    marginTop: spacing.sm,
  },
  tableRow: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderSoft },
  tableHead: { backgroundColor: colors.cardAlt },
  tableHeadCell: { flex: 1, color: colors.textDim, fontSize: 10.5, fontWeight: "800", padding: 7, textTransform: "uppercase" },
  tableCell: { flex: 1, color: colors.text, fontSize: 11, lineHeight: 15, padding: 7 },
});
