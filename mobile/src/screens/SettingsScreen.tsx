import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setSavedApiUrl, getApiBaseUrl, api } from "../api/client";
import { colors, baseStyles, spacing } from "../theme/theme";

const STORAGE_KEY = "aikh.apiBaseUrl";

export default function SettingsScreen() {
  const [url, setUrl] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<"" | "ok" | "fail">("");
  const [statusMsg, setStatusMsg] = useState("");

  const save = async () => {
    let clean = url.trim().replace(/\/+$/, "");
    if (clean && !/^https?:\/\//.test(clean)) clean = `http://${clean}`;
    setSavedApiUrl(clean || null);
    await AsyncStorage.setItem(STORAGE_KEY, clean);
    Alert.alert("Saved", `API server set to:\n${clean || "(default)"}`);
  };

  const test = async () => {
    setTesting(true);
    setStatus("");
    setStatusMsg("");
    try {
      const res = await api.get<{ service?: string; version?: string }>("/", 10000);
      setStatus("ok");
      setStatusMsg(`✅ Connected: ${res.service ?? "API"} v${res.version ?? "?"}`);
    } catch (e) {
      setStatus("fail");
      setStatusMsg(`❌ ${(e as Error).message}\n\nTips: use your PC's LAN IP (e.g. http://192.168.1.20:9000), same Wi-Fi, and backend running with --host 0.0.0.0`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <ScrollView style={baseStyles.screen} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.h2}>API Server</Text>
      <Text style={baseStyles.subtitle}>
        The mobile app talks to your existing FastAPI backend — the same one the web app uses. No separate backend is needed.
      </Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="http://192.168.1.20:9000"
        placeholderTextColor={colors.textFaint}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />
      <View style={styles.btnRow}>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={save}>
          <Text style={styles.btnTextPrimary}>Save</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnSecondary]} onPress={test} disabled={testing}>
          <Text style={styles.btnTextSecondary}>{testing ? "Testing…" : "Test connection"}</Text>
        </Pressable>
      </View>
      {statusMsg ? (
        <View style={[styles.statusBox, status === "ok" ? styles.statusOk : styles.statusFail]}>
          <Text style={styles.statusText}>{statusMsg}</Text>
        </View>
      ) : null}

      <Text style={[styles.h2, { marginTop: spacing.xl }]}>Quick start</Text>
      <Text style={styles.help}>
        1. Start the backend:{`\n`}   cd backend && uvicorn main:app --host 0.0.0.0 --port 9000{`\n`}
        2. Find your PC's LAN IP (ipconfig){`\n`}
        3. Set it above and tap Test{`\n`}
        4. For store builds use a public HTTPS URL (VPS / Railway / Fly.io)
      </Text>

      <Text style={[styles.h2, { marginTop: spacing.xl }]}>Why this works</Text>
      <Text style={styles.help}>
        One backend, three clients (web + iOS + Android). The React Native app is a new frontend only — all Python logic (market, news, videos, LinkedIn, files) is reused untouched.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h2: { color: colors.text, fontSize: 18, fontWeight: "800", marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    marginTop: spacing.md,
  },
  btnRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  btn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  btnPrimary: { backgroundColor: colors.accent },
  btnSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.accent,
  },
  btnTextPrimary: { color: "#fff", fontWeight: "800" },
  btnTextSecondary: { color: colors.accent, fontWeight: "800" },
  statusBox: {
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  statusOk: { backgroundColor: "rgba(61,220,132,0.12)" },
  statusFail: { backgroundColor: "rgba(255,93,115,0.12)" },
  statusText: { color: colors.text, fontSize: 13, lineHeight: 19 },
  help: { color: colors.textDim, fontSize: 13, lineHeight: 20 },
});
