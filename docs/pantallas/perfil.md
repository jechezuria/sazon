# Pantalla: Perfil (`app/(tabs)/perfil.tsx`)

Pantalla de perfil del usuario. Muestra información personal y accesos rápidos a acciones de cuenta.

**Referencia visual:** imagen de la app "Dishly" (Settings screen)  
**Design system:** `sazon-design-system.md` → sección 6 (Pantallas) y sección 2 (Componentes)

---

## Estructura visual

```
SafeAreaView
│
├── [HEADER]  ←  fijo, no scrollea
│   ← botón    "Mi perfil"    fantasma →
│
└── ScrollView
    ├── [CARD PERFIL]
    │     avatar  |  nombre + username + bio  |  >
    │
    ├── [SECCIÓN] MI CUENTA
    │     Editar perfil  >
    │     ─────────────────
    │     Cambiar contraseña  >
    │
    ├── [SECCIÓN] CONTENIDO
    │     Mis publicaciones  >
    │     ─────────────────
    │     Crear receta  >
    │
    └── [SECCIÓN] SESIÓN
          Cerrar sesión  >  (rojo)
```

---

## Imports (líneas 1–16)

```tsx
import React from 'react';
```
Obligatorio en cualquier archivo `.tsx` que use JSX (el HTML de React Native).

```tsx
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
```

| Componente | Para qué se usa en esta pantalla |
|---|---|
| `Alert` | Ventana de confirmación al cerrar sesión |
| `ScrollView` | Contenedor scrolleable para las secciones |
| `StyleSheet` | Crea los estilos (más eficiente que objetos inline) |
| `Text` | Todo texto visible va dentro de `<Text>` |
| `TouchableOpacity` | Hace elementos presionables con efecto de opacidad |
| `View` | Contenedor genérico (equivalente a `<div>`) |

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';
```
Se importa de esta librería (NO de `react-native`) porque la versión de Expo maneja mejor el notch y la barra home en distintos dispositivos.

```tsx
import { useRouter } from 'expo-router';
```
Hook de navegación. Nos da `router.back()` y `router.push('/ruta')`.

```tsx
import { Ionicons } from '@expo/vector-icons';
```
Librería de íconos incluida en Expo. Usamos nombres como `"chevron-back"`, `"person-outline"`, etc.

```tsx
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { shadows } from '@/theme/shadows';
```
Los tokens del design system. El `@/` es un alias para la raíz del proyecto (configurado en `tsconfig.json`).

```tsx
import { MOCK_USER } from '@/data/mockData';
```
Datos falsos del usuario mientras no hay backend. `MOCK_USER` contiene nombre, username, bio, etc.

---

## Componente `Avatar` (líneas 19–32)

**Dónde:** definido fuera de la pantalla principal, arriba del archivo.  
**Por qué afuera:** es un componente reutilizable. Al estar afuera, no se recrea en cada render de la pantalla.

```tsx
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')       // "Sofia Chen"  →  ["Sofia", "Chen"]
    .map((n) => n[0]) // →  ["S", "C"]
    .join('')         // →  "SC"
    .slice(0, 2)      // máximo 2 letras
    .toUpperCase();   // →  "SC"

  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}
```

**Estilos del avatar:**
```ts
avatar: {
  width: 56,
  height: 56,
  borderRadius: 28,          // width / 2 = círculo perfecto
  backgroundColor: colors.primaryLight,
  alignItems: 'center',
  justifyContent: 'center',
},
avatarText: {
  ...typography.h2,          // 17px, bold
  color: colors.primary,     // naranja
},
```

> **Regla:** `borderRadius = width / 2` para círculos de tamaño fijo.  
> `borderRadius: 9999` se usa solo cuando no sabés el tamaño (pills, tags).

---

## Componente `Separator` (líneas 35–37)

```tsx
function Separator() {
  return <View style={styles.separator} />;
}
```

Línea divisoria entre ítems del mismo grupo. El `/` cierra el tag en una sola línea porque el componente no tiene hijos.

```ts
separator: {
  height: 1,
  backgroundColor: colors.border,  // '#F0EDE8'
  marginLeft: 60,  // se alinea después del ícono (16px padding + 32px ícono + 12px gap)
},
```

---

## Componente `MenuItem` (líneas 39–78)

El `ProfileMenuItem` del design system. Estructura: `[ícono] → [texto] → [chevron]`.

```tsx
type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;  // solo acepta nombres válidos de Ionicons
  label: string;
  onPress: () => void;
  danger?: boolean;    // opcional, default false — pone todo en rojo
  rightLabel?: string; // opcional — muestra texto en vez de chevron (ej: "Español")
};
```

```tsx
function MenuItem({ icon, label, onPress, danger = false, rightLabel }: MenuItemProps) {
  const tint = danger ? colors.error : colors.primary;
  // Si danger=true → rojo. Si no → naranja. Una variable para no repetir la condición.
```

**Estructura JSX del ítem:**
```tsx
<TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>

  {/* 1. Ícono con fondo redondeado */}
  <View style={[styles.menuIconWrap, { backgroundColor: danger ? '#FDECEA' : colors.primaryLight }]}>
    <Ionicons name={icon} size={18} color={tint} />
  </View>

  {/* 2. Texto (flex:1 para empujar el chevron al borde) */}
  <Text style={[styles.menuLabel, danger && { color: colors.error }]}>
    {label}
  </Text>

  {/* 3. Chevron o texto de valor */}
  {rightLabel ? (
    <Text style={styles.menuRightLabel}>{rightLabel}</Text>
  ) : (
    <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
  )}

</TouchableOpacity>
```

> **Patrón:** `danger && { color: colors.error }` — si `danger` es `false`, el `&&` cortocircuita y no aplica el estilo. Si es `true`, aplica el objeto de estilo.

```ts
menuItem: {
  flexDirection: 'row',
  alignItems: 'center',
  height: 52,           // altura fija del design system
  paddingHorizontal: 16,
},
menuIconWrap: {
  width: 32,
  height: 32,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
},
menuLabel: {
  ...typography.bodyL,
  color: colors.textPrimary,
  flex: 1,  // ocupa todo el espacio, empuja el chevron a la derecha
},
```

---

## Componente `Section` (líneas 80–91)

Agrupa un label en mayúsculas con una card de ítems.

```tsx
function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.menuGroup}>{children}</View>
    </View>
  );
}
```

`children` es una prop especial de React: lo que pongas entre `<Section>` y `</Section>` aparece ahí.

```ts
sectionLabel: {
  ...typography.label,   // 11px, 600, UPPERCASE, letterSpacing 0.8
  color: colors.textMuted,
  marginBottom: 8,
  marginLeft: 4,
},
menuGroup: {
  backgroundColor: colors.surface,
  borderRadius: 16,
  overflow: 'hidden',   // ← IMPORTANTE: sin esto los ítems sobresalen del borderRadius
  ...shadows.card,
},
```

> **Truco:** `overflow: 'hidden'` en el contenedor hace que los hijos respeten el `borderRadius`. Sin él, los ítems de las esquinas sobresalen.

---

## Pantalla principal `PerfilScreen` (líneas 94–230)

### Setup (líneas 100–112)

```tsx
const router = useRouter();
const user = MOCK_USER;
```

`useRouter()` y `MOCK_USER` se asignan a variables locales al inicio de la función. Esto es el patrón estándar de React — toda la lógica de la pantalla va antes del `return`.

```tsx
function handleLogout() {
  Alert.alert(
    'Cerrar sesión',                    // título
    '¿Estás seguro que querés cerrar sesión?',  // mensaje
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => {} },
    ]
  );
}
```

`Alert.alert` recibe: título, mensaje, array de botones. `style: 'destructive'` pone el botón en rojo en iOS automáticamente.

---

### Paso 1 — Header (líneas 116–134)

**Posición en el árbol:** directamente dentro del `SafeAreaView`, ANTES del `ScrollView`.  
**Por qué afuera del ScrollView:** para que sea fijo y no se vaya al hacer scroll.

```tsx
<SafeAreaView style={styles.container} edges={['top']}>

  <View style={styles.header}>
    {/* hijo 1: botón volver */}
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
    </TouchableOpacity>

    {/* hijo 2: título */}
    <Text style={[typography.h1, { color: colors.textPrimary }]}>
      Mi perfil
    </Text>

    {/* hijo 3: espaciador fantasma */}
    <View style={{ width: 24 }} />
  </View>

  <ScrollView ...>
```

**¿Por qué el espaciador fantasma?**  
Con `justifyContent: 'space-between'` y 3 hijos, el espacio se distribuye en 3. El título queda perfectamente centrado porque el fantasma tiene el mismo ancho (24px) que el ícono de la izquierda.

```
[← 24px]  ←espacio→  [Mi perfil]  ←espacio→  [24px vacío]
```

Sin el fantasma habría solo 2 hijos y el título quedaría desplazado a la derecha.

```ts
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingVertical: 12,
},
```

---

### Paso 2 — Card de perfil (líneas 142–163)

**Posición:** primer elemento dentro del `ScrollView`.

```tsx
<TouchableOpacity style={styles.profileCard} activeOpacity={0.8}>
  <Avatar name={user.name} />

  <View style={styles.profileInfo}>
    <Text style={[typography.h2, { color: colors.textPrimary }]}>
      {user.name}
    </Text>

    <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
      @{user.username}
    </Text>

    {user.bio ? (
      <Text
        style={[typography.bodyS, { color: colors.textMuted, marginTop: 4 }]}
        numberOfLines={2}
      >
        {user.bio}
      </Text>
    ) : null}
  </View>

  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
</TouchableOpacity>
```

**Puntos clave:**

- `TouchableOpacity` (no `View`) porque toda la card va a navegar a "Editar perfil".
- `activeOpacity={0.8}` → al presionar, la card baja al 80% de opacidad (feedback visual).
- `user.bio ? (...) : null` → render condicional. Si no hay bio, no renderiza nada.
- `numberOfLines={2}` → trunca con `...` si la bio es muy larga.

```ts
profileCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.surface,  // blanco
  borderRadius: 16,
  padding: 16,
  marginBottom: 24,
  ...shadows.card,  // equivale a poner shadowColor, shadowOffset, etc.
},
profileInfo: {
  flex: 1,       // ← clave: ocupa el espacio entre avatar y chevron
  marginLeft: 12,
},
```

> **`flex: 1` en `profileInfo`:** sin él, el texto solo ocupa lo que necesita y el chevron queda pegado al texto. Con `flex: 1`, el texto se expande y el chevron va al borde derecho.

---

## Resumen de patrones aprendidos

| Patrón | Dónde aparece | Para qué sirve |
|---|---|---|
| Header fijo afuera del ScrollView | Paso 1 | Que no scrollee con el contenido |
| Espaciador fantasma | Header | Centrar un título cuando hay botón solo a un lado |
| `style={[estiloA, estiloB]}` | Títulos, labels | Combinar tokens del design system con colores locales |
| `flex: 1` en texto de fila | Card perfil, MenuItem | Empujar el elemento de la derecha al borde |
| `overflow: 'hidden'` | menuGroup | Que los hijos respeten el `borderRadius` del contenedor |
| `condition && { style }` | MenuItem (danger) | Aplicar un estilo solo si una condición es verdadera |
| `condition ? A : null` | Bio en card | Renderizar un elemento solo si existe un valor |
| `...shadows.card` | Cards | Spread de objeto para "aplanar" estilos de sombra |
| `borderRadius = width / 2` | Avatar | Hacer un círculo perfecto con tamaño conocido |
| `onPress={() => fn()}` | Todos los botones | Envolver en arrow function para no ejecutar al renderizar |
