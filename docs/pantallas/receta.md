# Pantalla: Detalle de Receta (`app/recipe/[id].tsx`)

Pantalla dinámica que muestra el detalle completo de una receta. La `[id]` en el nombre del archivo es el parámetro de ruta — Expo Router lo captura automáticamente.

**Referencia visual:** imagen de la app "Dishly" (Recipe Detail screen)  
**Design system:** `sazon-design-system.md` → sección 6 (Pantallas: Detalle de Receta)

> **Diferencias entre la imagen de referencia y lo que construimos:**
> | Imagen (Dishly) | Sazón |
> |---|---|
> | 4 botones: ← ♡ 🔖 ⬆ | 3 botones: ← ♡ ⬆ (sin bookmark) |
> | 3 MetaChips: tiempo, porciones, calorías | 2 MetaChips: tiempo, porciones (sin calorías) |
> | 3 tabs: Ingredients, Steps, Nutrition | 2 tabs: Ingredientes, Pasos (sin Nutrición) |

---

## Estructura visual

```
ScrollView
│
├── [PASO 1]  View (hero container)
│   ├── Image           ← foto full-width, aspect ratio 4:3
│   ├── LinearGradient  ← degradado oscuro en la mitad inferior (position: absolute)
│   └── View (botones)  ← [←]  [♡] [⬆]  (position: absolute)
│
└── [PANEL]  View (blanco, borderTopRadius 24, marginTop -24)
    ├── [PASO 2]  Text título
    │
    ├── [PASO 3]  View authorRow
    │   ├── SmallAvatar
    │   └── Text nombre
    │
    ├── [PASO 4]  View metaRow
    │   ├── MetaChip (⏱ tiempo)
    │   └── MetaChip (👥 porciones)
    │
    ├── [PASO 5]  Text descripción
    │
    ├── [PASO 6]  View tabBar
    │   ├── TouchableOpacity "Ingredientes"
    │   └── TouchableOpacity "Pasos"
    │
    ├── [PASO 7A] View tabContent — ingredientes (si tab activo)
    │   └── ingredientes.map → TouchableOpacity [radio] [nombre] [cantidad]
    │
    └── [PASO 7B] View tabContent — pasos (si tab activo)
        └── steps.map → View [badge #] [texto]
```

---

## Commits

| Commit | Qué incluye | Pasos |
|---|---|---|
| **commit 1** — hero image with floating buttons | `Image`, `LinearGradient`, botones flotantes con `position: absolute`, panel blanco con `marginTop: -24` | Paso 1 |
| **commit 2** — info panel (title, author, meta, description) | `SmallAvatar`, `MetaChip`, título, autor, chips, descripción | Pasos 2–5 |
| **commit 3** — tab selector with ingredients and steps | `useState` para tabs y checkboxes, `toggleCheck`, tab bar, lista ingredientes con `React.Fragment`, lista pasos | Pasos 6–7 |

---

## Conceptos nuevos (no vistos en Perfil)

### 1. Ruta dinámica `[id].tsx`

El archivo se llama `[id].tsx` con corchetes. Expo Router entiende que ese segmento es variable:

```
/recipe/recipe-1  →  id = "recipe-1"
/recipe/recipe-3  →  id = "recipe-3"
```

Para leer ese valor dentro del componente:
```tsx
const { id } = useLocalSearchParams<{ id: string }>();
```
El tipo genérico `<{ id: string }>` le dice a TypeScript que el parámetro `id` va a ser string.

### 2. `marginTop: -24` para el panel sobre la imagen

El panel blanco "sube" 24px sobre el borde inferior de la imagen:
```ts
panel: {
  marginTop: -24,              // valor negativo = sube sobre el elemento anterior
  borderTopLeftRadius: 24,     // esquinas redondeadas solo arriba
  borderTopRightRadius: 24,
}
```
El efecto visual es que el panel parece flotar encima de la foto.

### 3. `useState` — estado local

`useState` guarda un valor que puede cambiar. Cuando cambia, React re-renderiza el componente:
```tsx
const [activeTab, setActiveTab] = useState<Tab>('ingredientes');
// activeTab  → el valor actual
// setActiveTab → función para cambiarlo
// 'ingredientes' → valor inicial
```

### 4. `Set` de JavaScript

Estructura que guarda valores únicos. Ideal para IDs de ítems marcados:
```tsx
const [checked, setChecked] = useState<Set<string>>(new Set());
// new Set()         → conjunto vacío
// checked.has(id)   → ¿está marcado?
// next.add(id)      → marcar
// next.delete(id)   → desmarcar
```

---

## Imports (línea 1–13)

```tsx
import React, { useState } from 'react';
```
`useState` se importa de `react` directamente — no de `react-native`.

```tsx
import { Image } from 'expo-image';
```
Versión optimizada de `Image` con caché automático. Viene de `expo-image`, no de `react-native`.

```tsx
import { LinearGradient } from 'expo-linear-gradient';
```
Renderiza un degradado de colores. Lo usamos para oscurecer la parte inferior de la imagen del hero.

```tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
```
- `useLocalSearchParams` → lee el `[id]` de la URL
- `useRouter` → para `router.back()` al presionar el botón volver

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';
```
Devuelve los insets del dispositivo (tamaño del notch, barra home). Lo usamos para posicionar los botones del hero debajo del notch:
```tsx
const insets = useSafeAreaInsets();
// insets.top → altura del notch en píxeles
<View style={{ top: insets.top + 8 }} />
```

```tsx
import { Difficulty } from '@/types';
```
Importamos solo el tipo `Difficulty` para tipar el objeto `DIFFICULTY_COLOR`.

---

## Componentes helper (líneas 14–75)

### `SmallAvatar`

```tsx
function SmallAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={styles.smallAvatar}>
      <Text style={styles.smallAvatarText}>{initials}</Text>
    </View>
  );
}
```

Igual al `Avatar` de Perfil pero más chico (28px en vez de 56px). En el futuro esto podría extraerse a un componente compartido en `components/atoms/Avatar.tsx`.

```ts
smallAvatar: {
  width: 28,
  height: 28,
  borderRadius: 14,   // width / 2 = círculo
  backgroundColor: colors.primaryLight,
  alignItems: 'center',
  justifyContent: 'center',
},
```

### `MetaChip`

```tsx
function MetaChip({ icon, value, label }: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.metaChip}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.metaValue}>{value}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
    </View>
  );
}
```

```ts
metaChip: {
  flex: 1,                      // cada chip toma el mismo espacio en la fila
  backgroundColor: colors.primaryLight,
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 8,
  alignItems: 'center',         // columna centrada
  gap: 4,                       // espacio entre ícono, valor y label
},
```

---

## Pantalla principal `RecipeDetailScreen`

### Setup y estado (líneas 80–100)

```tsx
type Tab = 'ingredientes' | 'pasos';

const [activeTab, setActiveTab] = useState<Tab>('ingredientes');
const [checked,   setChecked]   = useState<Set<string>>(new Set());
```

Los dos `useState` se declaran antes del guard de "no encontrada". Esto es obligatorio en React: los hooks **siempre** se llaman en el mismo orden, nunca dentro de un `if`.

**Guard de receta no encontrada:**
```tsx
const recipe = getById(id as string);

if (!recipe) {
  return (
    <View style={styles.notFound}>
      <Text>Receta no encontrada</Text>
    </View>
  );
}
```
Si `getById` devuelve `undefined`, mostramos una pantalla de error y cortamos la ejecución con `return`. Todo el código de abajo solo corre si `recipe` existe.

**`toggleCheck`:**
```tsx
function toggleCheck(ingredientId: string) {
  setChecked((prev) => {
    const next = new Set(prev);                           // copia el Set anterior
    next.has(ingredientId) ? next.delete(ingredientId) : next.add(ingredientId);
    return next;                                          // devuelve la copia modificada
  });
}
```
Nunca modificamos el Set directamente — siempre creamos una copia (`new Set(prev)`) y devolvemos la copia. Esto es necesario porque React detecta cambios comparando referencias: si modificáramos el mismo objeto, React no vería la diferencia y no re-renderizaría.

---

### Paso 1 — Hero (líneas 106–142)

```tsx
<View>
  <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} contentFit="cover" />
  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={styles.heroGradient} />
  <View style={[styles.heroButtons, { top: insets.top + 8 }]}>
    ...botones...
  </View>
</View>
```

**`contentFit="cover"`** — equivalente a `object-fit: cover` en CSS. La imagen llena el espacio recortando si es necesario, sin deformarse.

**`LinearGradient`:**
```tsx
colors={['transparent', 'rgba(0,0,0,0.55)']}
```
El array de colores va de arriba a abajo. `transparent` arriba → negro semitransparente abajo. Hace legibles los botones y da profundidad.

```ts
heroGradient: {
  position: 'absolute',  // encima de la imagen, fuera del flujo
  bottom: 0,
  left: 0,
  right: 0,
  height: 140,           // solo la mitad inferior del hero
},
```

**Botones flotantes:**
```tsx
<View style={[styles.heroButtons, { top: insets.top + 8 }]}>
```
`insets.top` es la altura del notch (ej: 59px en iPhone 14). Sumarle 8px da respiro. Sin esto los botones quedarían debajo del notch y se verían cortados o superpuestos con el reloj.

```ts
heroButtons: {
  position: 'absolute',       // fuera del flujo, sobre la imagen
  left: 16,
  right: 16,
  flexDirection: 'row',
  justifyContent: 'space-between',  // ← izquierda, derecha →
},
heroBtn: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: 'rgba(255,255,255,0.92)',  // blanco casi opaco
  alignItems: 'center',
  justifyContent: 'center',
},
```

**Botón like con estado:**
```tsx
<Ionicons
  name={isLiked(recipe.id) ? 'heart' : 'heart-outline'}
  color={isLiked(recipe.id) ? colors.error : colors.textPrimary}
/>
```
Dos ternarios: uno para el ícono (relleno/vacío) y otro para el color (rojo/gris). `isLiked` viene del hook `useLikes`.

Solo hay un botón a la derecha (like). El de compartir fue removido — queda un solo botón en `heroBtnGroup`.

---

### Paso 2 — Título

```tsx
<Text style={styles.title} numberOfLines={3}>
  {recipe.title}
</Text>
```

```ts
title: {
  ...typography.displayL,
  color: colors.textPrimary,
},
```

---

### Paso 3 — Autor

```tsx
<View style={styles.authorRow}>
  <SmallAvatar name={recipe.author.name} />
  <Text style={styles.authorName}>{recipe.author.name}</Text>
</View>
```

```ts
authorRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginTop: 12,
},
```

---

### Paso 4 — MetaChips (líneas 167–170)

```tsx
<View style={styles.metaRow}>
  <MetaChip icon="time-outline"   value={recipe.cookTime}         label="Cook Time" />
  <MetaChip icon="people-outline" value={String(recipe.servings)} label="Porciones" />
</View>
```

`String(recipe.servings)` convierte el número `4` al string `"4"` porque el prop `value` del componente `MetaChip` es `string`. TypeScript tiraría error si pasáramos un `number` directamente.

---

### Paso 5 — Descripción (línea 173)

```tsx
<Text style={styles.description}>{recipe.description}</Text>
```

```ts
description: {
  ...typography.bodyM,
  color: colors.textSecondary,
  lineHeight: 22,    // más espacio entre líneas para párrafos largos
  marginTop: 16,
},
```

---

### Paso 6 — Tab Selector (líneas 175–186)

```tsx
<View style={styles.tabBar}>
  {(['ingredientes', 'pasos'] as Tab[]).map((tab) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tab, activeTab === tab && styles.tabActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </Text>
    </TouchableOpacity>
  ))}
</View>
```

**`(['ingredientes', 'pasos'] as Tab[])`** — creamos el array de tabs en el JSX y lo tipeamos como `Tab[]`. Así si mañana agregamos un tab, solo lo ponemos acá.

**`tab.charAt(0).toUpperCase() + tab.slice(1)`** — capitaliza la primera letra: `'ingredientes'` → `'Ingredientes'`. Alternativa a tener un objeto de labels separado.

**Lógica de estilo activo/inactivo:**
```tsx
style={[styles.tab, activeTab === tab && styles.tabActive]}
```
Si `activeTab === tab` es `true`, se aplica `styles.tabActive` (que agrega `borderBottomWidth: 2`). Si es `false`, el `&&` cortocircuita y no aplica nada.

```ts
tabBar: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: colors.border,   // línea base gris
  marginTop: 20,
},
tab: {
  flex: 1,
  paddingVertical: 12,
  alignItems: 'center',
},
tabActive: {
  borderBottomWidth: 2,               // sobrescribe la línea base con naranja
  borderBottomColor: colors.primary,
},
```

---

### Paso 7A — Lista de ingredientes (líneas 188–213)

```tsx
{activeTab === 'ingredientes' && (
  <View style={styles.tabContent}>
    <Text style={styles.tabCount}>{recipe.ingredients.length} ingredientes</Text>
    {recipe.ingredients.map((ing, index) => (
      <React.Fragment key={ing.id}>
        <TouchableOpacity
          style={styles.ingredientRow}
          onPress={() => toggleCheck(ing.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={checked.has(ing.id) ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color={checked.has(ing.id) ? colors.primary : colors.textMuted}
          />
          <Text style={[styles.ingredientName, checked.has(ing.id) && styles.ingredientChecked]}>
            {ing.name}
          </Text>
          <Text style={styles.ingredientAmount}>{ing.amount}</Text>
        </TouchableOpacity>
        {index < recipe.ingredients.length - 1 && <View style={styles.ingredientSep} />}
      </React.Fragment>
    ))}
  </View>
)}
```

**`React.Fragment`** — wrapper invisible que no agrega un `View` al DOM. Lo necesitamos porque queremos que cada ítem de la lista tenga `key` pero renderice dos elementos (`TouchableOpacity` + `View` separador). Sin `Fragment`, tendríamos que envolver en un `View` y eso agregaría nodos innecesarios.

**`{index < recipe.ingredients.length - 1 && <View ... />}`** — el separador solo aparece entre ítems, no después del último. `length - 1` es el índice del último elemento.

**Badge del ingrediente — transparente con número, verde con check al marcar:**

```tsx
<View style={[
  styles.ingredientBadge,
  checked.has(ing.id) && styles.ingredientBadgeChecked,
]}>
  {checked.has(ing.id) ? (
    <Ionicons name="checkmark" size={14} color={colors.surface} />
  ) : (
    <Text style={styles.ingredientNumber}>{index + 1}</Text>
  )}
</View>
```

- Sin marcar: círculo con borde `colors.border`, fondo transparente, número del ingrediente
- Marcado: fondo `colors.success` (verde), borde verde, ícono `checkmark` blanco

```ts
ingredientBadge: {
  width: 28,
  height: 28,
  borderRadius: 14,
  borderWidth: 1.5,
  borderColor: colors.border,
  backgroundColor: 'transparent',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
},
ingredientBadgeChecked: {
  backgroundColor: colors.success,
  borderColor: colors.success,
},
ingredientNumber: {
  ...typography.caption,
  fontWeight: '600',
  color: colors.textMuted,
},
ingredientChecked: {
  textDecorationLine: 'line-through',
  color: colors.textMuted,
},
ingredientSep: {
  height: 1,
  backgroundColor: colors.border,
  marginLeft: 40,   // 28px badge + 12px gap
},
```

> **Por qué `marginLeft: 40` y no `32`:** el badge ahora mide 28px (antes era un ícono de 20px). 28 + 12 (gap) = 40. El separador empieza alineado con el texto del ingrediente.

---

### Paso 7B — Lista de pasos (líneas 215–229)

```tsx
{activeTab === 'pasos' && (
  <View style={styles.tabContent}>
    {recipe.steps.map((step) => (
      <View key={step.id} style={styles.stepRow}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepNumber}>{step.order}</Text>
        </View>
        <Text style={styles.stepText}>{step.description}</Text>
      </View>
    ))}
  </View>
)}
```

Sin estado — solo renderiza. No necesita `React.Fragment` porque cada step tiene solo un elemento raíz (`View`).

```ts
stepRow: {
  flexDirection: 'row',
  gap: 16,
  marginBottom: 20,
},
stepBadge: {
  width: 32,
  height: 32,
  borderRadius: 16,            // círculo
  backgroundColor: colors.primary,
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,               // no se achica si el texto del paso es muy largo
},
stepNumber: {
  ...typography.buttonSm,
  color: colors.surface,       // blanco sobre naranja
},
stepText: {
  ...typography.bodyM,
  color: colors.textSecondary,
  flex: 1,                     // ocupa el espacio restante
  lineHeight: 22,
},
```

---

## Resumen de patrones nuevos

| Patrón | Dónde | Para qué |
|---|---|---|
| `[id].tsx` | Nombre del archivo | Ruta dinámica — un archivo para todas las recetas |
| `useLocalSearchParams<{ id: string }>()` | Setup | Leer el parámetro de la URL con tipo |
| `useSafeAreaInsets()` | Botones hero | Posicionar elementos respetando el notch |
| `useState<Tab>` | Tab selector | Estado local que re-renderiza al cambiar |
| `useState<Set<string>>` | Checkboxes | Set de IDs marcados |
| `new Set(prev)` en setter | `toggleCheck` | Copiar antes de mutar — React necesita nueva referencia |
| `marginTop: -24` | Panel sobre hero | Solapar el panel blanco con la imagen |
| `contentFit="cover"` | `expo-image` | Equivalente a `object-fit: cover` |
| `LinearGradient` | Hero | Degradado de `transparent` a oscuro para legibilidad |
| `position: 'absolute'` | Gradiente y botones | Superponer sobre la imagen |
| `insets.top + 8` | Botones hero | Respetar el notch en cualquier dispositivo |
| `React.Fragment` con `key` | Ingredientes | Wrapper invisible para listas con múltiples nodos por ítem |
| `index < arr.length - 1` | Separador ingredientes | Separador entre ítems, no después del último |
| `String(recipe.servings)` | MetaChip | Convertir número a string para prop tipada |
| `flexShrink: 0` | stepBadge | Evitar que el elemento se encoja en una fila |
| `tab.charAt(0).toUpperCase() + tab.slice(1)` | Tab labels | Capitalizar string sin librería |
| `textDecorationLine: 'line-through'` | Ingrediente marcado | Tachar texto |
| `alignItems: 'flex-start'` | titleRow | Alinear badge arriba cuando el título es multilínea |
