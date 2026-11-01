import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { CatalogResultItem, getCatalogCategories, searchCatalog } from "../api/api";
import { colors, spacing } from "../theme/theme";
import {
  ChipRow,
  EmptyView,
  ErrorView,
  LargeTitle,
  ListRow,
  LoadingView,
  SearchBar,
  StatStrip,
} from "../components/ui";

export type CatalogListParams = {
  catalogKey: string;
  title?: string;
  icon?: string;
  desc?: string;
};

function iconOf(item: Record<string, unknown>, fallback?: string): string | undefined {
  if (fallback) return fallback;
  const v = item.icon ?? item.emoji ?? item.flag;
  return typeof v === "string" ? v : undefined;
}

function metaOf(item: Record<string, unknown>): string {
  const bits: string[] = [];
  const push = (label: string, v: unknown) => {
    if (v !== undefined && v !== null && v !== "" && v !== 0) bits.push(`${label}${v}`);
  };
  push("⭐ ", item.stars);
  push("📅 ", item.year);
  push("📄 ", item.pages);
  push("👤 ", item.author);
  push("🏢 ", item.company);
  push("📍 ", item.location ?? item.country);
  push("💼 ", item.difficulty);
  push("📚 ", item.lessonsCount);
  if (item.top === true) bits.push("🔥 Top");
  if (typeof item.rating === "number") bits.push(`★ ${item.rating}`);
  if (Array.isArray(item.features) && item.features.length) bits.push(item.features.slice(0, 2).join(" · "));
  if (Array.isArray(item.lessons) && item.lessons.length) bits.push(`${item.lessons.length} lessons`);
  if (item.url && !bits.length) bits.push(String(item.url).replace(/^https?:\/\/(www\.)?/, "").split("/")[0]);
  return bits.join("   ");
}

export default function CatalogListScreen({ route, navigation }: any) {
  const { catalogKey, title, icon, desc }: CatalogListParams = route.params;
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<CatalogResultItem[]>([]);
  const [lastTotal, setLastTotal] = useState(0);
  const [lastPages, setLastPages] = useState(1);

  const catsQ = useQuery({
    queryKey: ["catalog-cats", catalogKey],
    queryFn: () => getCatalogCategories(catalogKey),
    staleTime: 5 * 60_000,
  });

  const listQ = useQuery({
    queryKey: ["catalog-list", catalogKey, q, category, page],
    queryFn: () => searchCatalog(catalogKey, { q, category: category || undefined, page, page_size: 40 }),
    staleTime: 5 * 60_000,
  });

  React.useEffect(() => {
    navigation?.setOptions?.({ title: title ?? "Catalog" });
  }, [title]);

  // Accumulate pages for infinite scroll; reset on filter change.
  React.useEffect(() => {
    const d = listQ.data;
    if (!d) return;
    setLastTotal(d.total);
    setLastPages(d.pages);
    setItems((prev) => {
      if (page === 1) return d.results;
      const seen = new Set(prev.map((p) => p.idx));
      return [...prev, ...d.results.filter((r) => !seen.has(r.idx))];
    });
  }, [listQ.data, page]);

  React.useEffect(() => {
    setPage(1);
  }, [q, category]);

  const categoryChips = useMemo(() => {
    const cats = catsQ.data?.categories ?? [];
    // Cap chip count (github has 188 categories) — the rest are reachable via search.
    return [
      { key: "", label: "All" },
      ...cats.slice(0, 24).map((c) => ({ key: c.name, label: c.name, count: c.count })),
    ];
  }, [catsQ.data]);

  if (listQ.isLoading && page === 1) return <LoadingView label={`Loading ${title ?? "catalog"}…`} />;
  if (listQ.isError) return <ErrorView message={String((listQ.error as Error)?.message)} onRetry={() => listQ.refetch()} />;

  const totalLabel = lastTotal ? lastTotal.toLocaleString() : "…";

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={items}
        keyExtractor={(r) => `${r.idx}`}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        ListHeaderComponent={
          <View>
            <LargeTitle title={title ?? "Catalog"} subtitle={desc} />
            <StatStrip
              stats={[
                { label: "Total", value: totalLabel },
                { label: "Categories", value: catsQ.data?.count ?? "…" },
                { label: "Page", value: `${page}/${Math.min(lastPages, 999)} ` },
              ]}
            />
            <SearchBar value={q} onChange={setQ} placeholder={`Search ${totalLabel} items…`} />
            {categoryChips.length > 1 ? (
              <ChipRow
                items={categoryChips as any}
                activeKey={category}
                onSelect={(k) => setCategory(k)}
              />
            ) : null}
          </View>
        }
        renderItem={({ item: r }) => (
          <ListRow
            icon={iconOf(r.item, icon)}
            title={r.title}
            subtitle={r.subtitle}
            meta={metaOf(r.item)}
            url={typeof r.item.url === "string" ? r.item.url : undefined}
            onPress={() =>
              (navigation as any).navigate("CatalogItem", {
                catalogKey,
                idx: r.idx,
                id: r.id,
                title: r.title,
              })
            }
          />
        )}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (!listQ.isFetching && page < lastPages) setPage((p) => p + 1);
        }}
        ListFooterComponent={
          listQ.isFetching && page > 1 ? (
            <LoadingView label="Loading more…" />
          ) : items.length === 0 ? (
            <EmptyView message={`No matches for “${q || category || "…"}”`} icon="🔍" />
          ) : null
        }
      />
    </View>
  );
}
