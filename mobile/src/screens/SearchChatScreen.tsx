import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchAll, chat, SearchResult, ChatResponse } from "../api/api";
import { getApiBaseUrl } from "../api/client";
import { colors, baseStyles, spacing } from "../theme/theme";

type Msg = { role: "user" | "bot"; text: string; sources?: ChatResponse["sources"] };

export default function SearchChatScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<Msg>>(null);
  const [tab, setTab] = useState<"search" | "chat">("search");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searchErr, setSearchErr] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);

  const doSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchErr("");
    try {
      const res = await searchAll(query.trim());
      setResults(res.results ?? []);
    } catch (e) {
      setSearchErr((e as Error).message);
    } finally {
      setSearching(false);
    }
  };

  const sendChat = async () => {
    const msg = chatInput.trim();
    if (!msg || chatBusy) return;
    setChatInput("");
    const history = [...messages, { role: "user" as const, text: msg }];
    setMessages(history);
    setChatBusy(true);
    try {
      const res = await chat(msg);
      setMessages([...history, { role: "bot", text: res.answer, sources: res.sources }]);
    } catch (e) {
      setMessages([...history, { role: "bot", text: `Error: ${(e as Error).message}` }]);
    } finally {
      setChatBusy(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={baseStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Tab switcher */}
      <View style={styles.tabs}>
        {(["search", "chat"] as const).map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "search" ? "🔍 Search" : "💬 AI Chat"}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "search" ? (
        <View style={{ flex: 1, paddingHorizontal: spacing.lg }}>
          <View style={styles.inputRow}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search chapters, deep dives, tags…"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
              onSubmitEditing={doSearch}
              returnKeyType="search"
            />
            <Pressable style={styles.goBtn} onPress={doSearch} disabled={searching}>
              {searching ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.goText}>Go</Text>}
            </Pressable>
          </View>
          {searchErr ? <Text style={styles.errText}>{searchErr}</Text> : null}
          <FlatList
            data={results ?? []}
            keyExtractor={(r, i) => `${r.chapter_id}-${i}`}
            contentContainerStyle={{ paddingBottom: spacing.xxl }}
            ListEmptyComponent={
              !searching && results !== null ? (
                <Text style={styles.emptyText}>No matches. Try: RAG, agents, vector db, fine-tuning…</Text>
              ) : null
            }
            renderItem={({ item }) => (
              <View style={baseStyles.card}>
                <Text style={baseStyles.title}>{item.chapter_title}</Text>
                {item.section_heading ? (
                  <Text style={styles.sectionHit}>↳ {item.section_heading}</Text>
                ) : null}
                <Text style={baseStyles.subtitle} numberOfLines={3}>
                  {item.snippet}
                </Text>
                <Text style={baseStyles.faint}>
                  {item.type === "deep-dive" ? "Deep dive" : "Chapter"} · score {Math.round(item.score * 100)}%
                </Text>
              </View>
            )}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(_, i) => `m-${i}`}
            contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.md }}
            ListEmptyComponent={
              <View style={baseStyles.center}>
                <Text style={styles.emptyIcon}>💬</Text>
                <Text style={styles.emptyText}>
                  Ask about RAG pipelines, AI agents, vector databases,{"\n"}prompt engineering, GRC, system design…
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.role === "user" ? styles.bubbleUser : styles.bubbleBot]}>
                <Text style={item.role === "user" ? styles.bubbleUserText : styles.bubbleBotText}>
                  {item.text}
                </Text>
                {item.sources?.length ? (
                  <View style={{ marginTop: spacing.sm }}>
                    {item.sources.map((s, i) => (
                      <Text key={i} style={styles.sourceText}>
                        🔗 {s.title}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            )}
          />
          <View style={[styles.chatInputRow, { paddingBottom: insets.bottom + spacing.sm }]}>
            <TextInput
              value={chatInput}
              onChangeText={setChatInput}
              placeholder="Ask a question…"
              placeholderTextColor={colors.textFaint}
              style={styles.chatInput}
              onSubmitEditing={sendChat}
              returnKeyType="send"
            />
            <Pressable style={styles.goBtn} onPress={sendChat} disabled={chatBusy}>
              {chatBusy ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.goText}>➤</Text>}
            </Pressable>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
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
  inputRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
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
  chatInput: {
    flex: 1,
    backgroundColor: colors.cardAlt,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    fontSize: 15,
  },
  goBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  goText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  errText: { color: colors.red, fontSize: 13, marginBottom: spacing.sm },
  emptyText: { color: colors.textDim, fontSize: 14, textAlign: "center", marginTop: spacing.xl, lineHeight: 21 },
  emptyIcon: { fontSize: 40, marginTop: 60 },
  sectionHit: { color: colors.accent, fontSize: 13, fontWeight: "600", marginTop: 2 },
  bubble: {
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    maxWidth: "88%",
  },
  bubbleUser: { backgroundColor: colors.accent, alignSelf: "flex-end" },
  bubbleBot: { backgroundColor: colors.card, alignSelf: "flex-start", borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  bubbleUserText: { color: "#fff", fontSize: 15, lineHeight: 21 },
  bubbleBotText: { color: colors.text, fontSize: 15, lineHeight: 21 },
  sourceText: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  chatInputRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
});
