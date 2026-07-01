import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme/colors";
import { shadows } from "@/theme/shadows";
import { typography } from "@/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
  rightLabel?: string;
};

function MenuItem({ icon, label, onPress, danger = false, rightLabel }: MenuItemProps) {
  const tint = danger ? colors.error : colors.primary;
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.menuIconWrap, { backgroundColor: danger ? "#FDECEA" : colors.primaryLight }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <Text style={[styles.menuLabel, danger && { color: colors.error }]}>{label}</Text>
      {rightLabel ? (
        <Text style={styles.menuRightLabel}>{rightLabel}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.menuGroup}>{children}</View>
    </View>
  );
}

export default function PerfilScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    Alert.alert("Cerrar sesión", "¿Estás seguro que querés cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>Mi perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.8} onPress={() => router.push('/perfil/editar')}>
          <Avatar name={user?.name ?? '?'} />
          <View style={styles.profileInfo}>
            <Text style={[typography.h2, { color: colors.textPrimary }]}>{user?.name ?? ''}</Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
              @{user?.username ?? ''}
            </Text>
            {user?.bio ? (
              <Text style={[typography.bodyS, { color: colors.textMuted, marginTop: 4 }]} numberOfLines={2}>
                {user.bio}
              </Text>
            ) : null}
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <Section title="Mi cuenta">
          <MenuItem icon="person-outline" label="Editar perfil" onPress={() => router.push('/perfil/editar')} />
          <Separator />
          <MenuItem icon="lock-closed-outline" label="Cambiar contraseña" onPress={() => {}} />
        </Section>

        <Section title="Contenido">
          <MenuItem icon="bookmark-outline" label="Mis publicaciones" onPress={() => router.push('/perfil/publicaciones')} />
          <Separator />
          <MenuItem icon="heart-outline" label="Mis favoritos" onPress={() => router.push('/perfil/favoritos')} />
          <Separator />
          <MenuItem icon="add-circle-outline" label="Crear receta" onPress={() => router.push("/crear/detalles")} />
        </Section>

        <Section title="Sesión">
          <MenuItem icon="log-out-outline" label="Cerrar sesión" onPress={handleLogout} danger />
        </Section>

        <Text style={styles.footer}>Sazón v1.0 · Hecho con ❤️ para los que cocinan</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...shadows.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { ...typography.h2, color: colors.primary },
  profileInfo: { flex: 1, marginLeft: 12 },
  section: { marginBottom: 20 },
  sectionLabel: { ...typography.label, color: colors.textMuted, marginBottom: 8, marginLeft: 4 },
  menuGroup: { backgroundColor: colors.surface, borderRadius: 16, overflow: "hidden", ...shadows.card },
  menuItem: { flexDirection: "row", alignItems: "center", height: 52, paddingHorizontal: 16 },
  menuIconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", marginRight: 12 },
  menuLabel: { ...typography.bodyL, color: colors.textPrimary, flex: 1 },
  menuRightLabel: { ...typography.bodyM, color: colors.textSecondary, marginRight: 4 },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 60 },
  footer: { ...typography.caption, color: colors.textMuted, textAlign: "center", marginTop: 12 },
});
