import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.8}>
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
            onPress={() => {}}
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
