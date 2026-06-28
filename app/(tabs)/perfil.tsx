import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";

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
