import { MOCK_USER } from "@/data/mockData";
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

// ─── Avatar con iniciales ─────────────────────────────────────────────────────
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

// ─── Separador entre ítems del mismo grupo ────────────────────────────────────
function Separator() {
  return <View style={styles.separator} />;
}

// ─── Ítem de menú (ProfileMenuItem del design system) ────────────────────────
// Estructura: [ícono] [label] [chevron]  —  altura 52px
type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
  rightLabel?: string;
};

function MenuItem({
  icon,
  label,
  onPress,
  danger = false,
  rightLabel,
}: MenuItemProps) {
  const tint = danger ? colors.error : colors.primary;

  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {/* Ícono izquierda */}
      <View
        style={[
          styles.menuIconWrap,
          { backgroundColor: danger ? "#FDECEA" : colors.primaryLight },
        ]}
      >
        <Ionicons name={icon} size={18} color={tint} />
      </View>

      {/* Texto principal */}
      <Text style={[styles.menuLabel, danger && { color: colors.error }]}>
        {label}
      </Text>

      {/* Valor opcional (ej: "Español") o chevron */}
      {rightLabel ? (
        <Text style={styles.menuRightLabel}>{rightLabel}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

// ─── Grupo de sección (label + card con ítems) ────────────────────────────────
type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      {/* Label de sección en MAYÚSCULAS — usa typography.label */}
      <Text style={styles.sectionLabel}>{title}</Text>

      {/* Card blanca que agrupa los ítems */}
      <View style={styles.menuGroup}>{children}</View>
    </View>
  );
}
// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function PerfilScreen() {
  const router = useRouter();
  const user = MOCK_USER;

  function handleLogout() {
    Alert.alert("Cerrar sesión", "¿Estás seguro que querés cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: () => {} },
    ]);
  }

  return (
    // SafeAreaView maneja el espacio del notch y la barra home
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ── PASO 1: Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[typography.h1, { color: colors.textPrimary }]}>
          Mi perfil
        </Text>

        {/* Espaciador fantasma para centrar el título */}
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── PASO 2: Card de perfil ── */}
        {/* TouchableOpacity porque va a navegar a "Editar perfil" */}
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.8} onPress={() => router.push('/perfil/editar')}>
          <Avatar name={user.name} />

          <View style={styles.profileInfo}>
            <Text style={[typography.h2, { color: colors.textPrimary }]}>
              {user.name}
            </Text>
            <Text
              style={[
                typography.caption,
                { color: colors.textSecondary, marginTop: 2 },
              ]}
            >
              @{user.username}
            </Text>
            {user.bio ? (
              <Text
                style={[
                  typography.bodyS,
                  { color: colors.textMuted, marginTop: 4 },
                ]}
                numberOfLines={2}
              >
                {user.bio}
              </Text>
            ) : null}
          </View>

          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* ── PASO 3: Sección MI CUENTA ── */}
        {/* Cada Section tiene un label en mayúsculas + un grupo de ítems */}
        <Section title="Mi cuenta">
          <MenuItem
            icon="person-outline"
            label="Editar perfil"
            onPress={() => router.push('/perfil/editar')}
          />
          <Separator />
          <MenuItem
            icon="lock-closed-outline"
            label="Cambiar contraseña"
            onPress={() => {}}
          />
        </Section>

        {/* ── PASO 4: Sección CONTENIDO ── */}
        <Section title="Contenido">
          <MenuItem
            icon="bookmark-outline"
            label="Mis publicaciones"
            onPress={() => {}}
          />
          <Separator/>
          <MenuItem
            icon="heart-outline"
            label="Mis favoritos"
            onPress={() => router.push("favoritos")}
          />
          <Separator />
          <MenuItem
            icon="add-circle-outline"
            label="Crear receta"
            onPress={() => router.push("/crear/detalles")}
          />
        </Section>

        {/* ── PASO 5: Sección SESIÓN ── */}
        {/* El prop danger=true pone el color rojo y fondo rojo suave */}
        <Section title="Sesión">
          <MenuItem
            icon="log-out-outline"
            label="Cerrar sesión"
            onPress={handleLogout}
            danger
          />
        </Section>

        {/* ── PASO 6: Footer ── */}
        <Text style={styles.footer}>
          Sazón v1.0 · Hecho con ❤️ para los que cocinan
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // PASO 1 — Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // PASO 2 — Card de perfil
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

  avatarText: {
    ...typography.h2,
    color: colors.primary,
  },

  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },

  // PASO 3/4/5 — Secciones
  section: {
    marginBottom: 20,
  },

  // Label en MAYÚSCULAS — usa typography.label del design system
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Card blanca que contiene los ítems del grupo
  menuGroup: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    ...shadows.card,
  },

  // Ítem individual — altura 52px, padding 16px horizontal
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: 16,
  },

  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  menuLabel: {
    ...typography.bodyL,
    color: colors.textPrimary,
    flex: 1,
  },

  menuRightLabel: {
    ...typography.bodyM,
    color: colors.textSecondary,
    marginRight: 4,
  },

  // Línea separadora entre ítems del mismo grupo
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 60, // alineada después del ícono
  },

  // PASO 6 — Footer
  footer: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 12,
  },
});
