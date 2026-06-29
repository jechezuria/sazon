# Pantalla: Detalle de Receta (`app/recipe/[id].tsx`)

Pantalla dinámica que muestra el detalle completo de una receta. La `[id]` en el nombre del archivo es el parámetro de ruta — Expo Router lo captura automáticamente.

**Referencia visual:** imagen de la app "Dishly" (Recipe Detail screen)  
**Design system:** `sazon-design-system.md` → sección 6 (Pantallas: Detalle de Receta)

> **Diferencias entre la imagen de referencia y lo que vamos a construir:**
> | Imagen (Dishly) | Sazón (nuestro) |
> |---|---|
> | 3 botones flotantes: ← ♡ 🔖 ⬆ | 3 botones: ← ♡ ⬆ (sin bookmark) |
> | 3 MetaChips: tiempo, porciones, calorías | 2 MetaChips: tiempo, porciones (sin calorías) |
> | 3 tabs: Ingredients, Steps, Nutrition | 2 tabs: Ingredientes, Pasos (sin Nutrición) |

---

## Estructura visual

```
┌─────────────────────────────┐
│                             │
│    [PASO 1]  HERO IMAGE     │  ← imagen full-width, aspect ratio 4:3
│    foto de la receta        │
│                             │
│  [←]              [♡] [⬆]  │  ← botones flotantes sobre la imagen
│                             │
├──────────────────────────── ┤  ← panel blanco con borderRadius arriba
│                             │
│  [PASO 2]  TÍTULO + BADGE   │  "Panqueques de Avena"   [FÁCIL]
│  [PASO 3]  AUTOR + STARS    │  avatar · "Sofia Chen" ★★★★☆ 342 reseñas
│                             │
│  [PASO 4]  META CHIPS       │  [ ⏱ 20 min ] [ 👥 4 porciones ]
│                             │
│  [PASO 5]  DESCRIPCIÓN      │  texto descriptivo del plato
│                             │
│  [PASO 6]  TAB SELECTOR     │  [ Ingredientes ]  [ Pasos ]
│  ─────────────────────────  │
│  [PASO 7A] LISTA INGREDIEN. │  ○ Avena          1 taza
│            (tab activo)     │  ○ Banana madura   1 grande
│                             │  ○ Huevos          2 unidades
│  [PASO 7B] LISTA PASOS      │  ① Licuá la avena...
│            (tab inactivo)   │  ② Dejá reposar...
└─────────────────────────────┘
```

---

## Conceptos nuevos en esta pantalla

Antes de arrancar con los pasos, hay 3 conceptos que no aparecieron en la pantalla de Perfil:

### 1. Ruta dinámica con `[id]`

El archivo se llama `[id].tsx` (con corchetes). Eso le dice a Expo Router que ese segmento de la URL es un **parámetro variable**. Ejemplos:

```
/recipe/recipe-1  →  id = "recipe-1"
/recipe/recipe-3  →  id = "recipe-3"
```

Para leer ese parámetro dentro del componente:
```tsx
const { id } = useLocalSearchParams<{ id: string }>();
```
El `<{ id: string }>` es TypeScript diciéndole "el parámetro `id` va a ser un string".

### 2. Scroll sobre imagen fija (hero + contenido)

El hero (imagen) es fijo en la parte superior. El contenido de abajo scrollea. La técnica es usar un `ScrollView` que **arranca transparente sobre la imagen** y el panel blanco flota encima con `borderTopLeftRadius` y `borderTopRightRadius`.

Hay dos formas de hacerlo:
- **Opción A:** `ScrollView` con el hero como primer elemento (más simple, el hero scrollea con el contenido)
- **Opción B:** Imagen fija + `ScrollView` absoluto encima (el hero queda fijo mientras el contenido sube)

Vamos a usar la **Opción A** por simplicidad — el hero scrollea con el contenido.

### 3. Estado local para el tab activo

La pantalla tiene un tab selector (Ingredientes / Pasos). Necesitamos recordar qué tab está activo:

```tsx
const [activeTab, setActiveTab] = useState<'ingredientes' | 'pasos'>('ingredientes');
```

`useState` es un hook de React que guarda un valor que puede cambiar. Cuando cambia, React re-renderiza el componente automáticamente.

---

## Paso a paso

---

### Paso 1 — Hero con botones flotantes

**Archivo:** `app/recipe/[id].tsx`  
**Qué es:** imagen de la receta a pantalla completa (aspect ratio 4:3) con 3 botones superpuestos.

```
┌─────────────────────────────┐
│  foto de la receta          │  ← Image, aspect ratio 4:3
│  con gradiente oscuro abajo │  ← LinearGradient encima
│                             │
│  [←]              [♡] [⬆]  │  ← posición absoluta sobre la imagen
└─────────────────────────────┘
```

**Componentes que se usan:**
- `Image` de `expo-image` → para mostrar la foto con caché
- `LinearGradient` de `expo-linear-gradient` → el degradado oscuro de abajo
- `TouchableOpacity` x3 → los 3 botones (circular, fondo blanco semitransparente)
- `Ionicons` → íconos de los botones

**Posicionamiento de los botones:**
Los botones van con `position: 'absolute'` sobre la imagen. La fila de botones se divide:
- Botón `←` pegado a la izquierda (`left: 16`)
- Botones `♡` y `⬆` pegados a la derecha (`right: 16`)

```
position: 'absolute'   →  saca el elemento del flujo normal
top: (SafeArea)        →  lo ubica desde arriba
left/right: 16         →  lo ubica desde el costado
```

**Estilos clave:**
```ts
heroImage: {
  width: '100%',
  aspectRatio: 4/3,    // ← calcula la altura automáticamente según el ancho
},
heroOverlay: {
  position: 'absolute',  // encima de la imagen
  bottom: 0,
  left: 0,
  right: 0,
  height: 120,           // solo la mitad inferior
},
heroButtons: {
  position: 'absolute',
  top: 52,               // debajo del notch
  left: 16,
  right: 16,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
heroBtn: {
  width: 40,
  height: 40,
  borderRadius: 20,         // círculo
  backgroundColor: 'rgba(255,255,255,0.9)',
  alignItems: 'center',
  justifyContent: 'center',
},
```

---

### Paso 2 — Título y badge de dificultad

**Qué es:** fila con el nombre de la receta a la izquierda y el badge "FÁCIL/MEDIO/DIFÍCIL" a la derecha.

```
Panqueques de Avena        [FÁCIL]
```

**Componentes:**
- `Text` con `typography.displayL` → título grande
- `View` (badge) con fondo de color según dificultad + `Text` con `typography.label`

```ts
// Colores según dificultad (del design system, variante difficulty del Tag)
const difficultyColor = {
  'Fácil':   { bg: '#E8F5E9', text: '#388E3C' },  // verde
  'Medio':   { bg: '#FFF8E1', text: '#F9A825' },  // amarillo
  'Difícil': { bg: '#FFEBEE', text: '#C62828' },  // rojo
};
```

**Estilos clave:**
```ts
titleRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',   // alinea arriba (el badge no estira el título)
  justifyContent: 'space-between',
  gap: 12,
},
badge: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 9999,          // pill
  flexShrink: 0,               // no se encoge aunque el título sea largo
},
```

---

### Paso 3 — Autor y calificación

**Qué es:** fila con avatar pequeño, nombre del autor, estrellas y cantidad de reseñas.

```
[SC]  Sofia Chen  ★★★★☆  342 reseñas
```

**Componentes:**
- `Avatar` (reutilizable de perfil, size 28px)
- `Text` nombre del autor
- Estrellas: 5 íconos `star` / `star-outline` de Ionicons en color `colors.rating`
- `Text` con el conteo de reseñas

**Estilos clave:**
```ts
authorRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginTop: 8,
},
starsRow: {
  flexDirection: 'row',
  gap: 2,
},
```

---

### Paso 4 — MetaChips (tiempo y porciones)

**Qué es:** fila de 2 chips con ícono + valor + label debajo.

```
┌──────────────┐  ┌──────────────┐
│  ⏱  20 min  │  │  👥  4       │
│  Cook Time   │  │  Porciones   │
└──────────────┘  └──────────────┘
```

**Componentes:**
- `View` fila
- 2x `MetaChip`: `View` con fondo `primaryLight`, ícono, valor en bold, label debajo

**Estilos clave:**
```ts
metaRow: {
  flexDirection: 'row',
  gap: 12,
  marginTop: 16,
},
metaChip: {
  flex: 1,                    // cada chip ocupa el mismo espacio
  backgroundColor: colors.primaryLight,
  borderRadius: 12,
  padding: 12,
  alignItems: 'center',
  gap: 4,
},
```

---

### Paso 5 — Descripción

**Qué es:** párrafo de texto con la descripción de la receta.

```ts
description: {
  ...typography.bodyM,
  color: colors.textSecondary,
  lineHeight: 22,
  marginTop: 16,
},
```

Sin lógica especial. Solo un `Text` que muestra `recipe.description`.

---

### Paso 6 — Tab Selector (Ingredientes / Pasos)

**Qué es:** 2 tabs que controlan qué lista se muestra abajo.

```
[ Ingredientes ]  [ Pasos ]
 ───────────────
```

**Estado que controla el tab:**
```tsx
const [activeTab, setActiveTab] = useState<'ingredientes' | 'pasos'>('ingredientes');
```

**Lógica visual del tab activo vs inactivo:**
- Activo: texto `colors.primary`, línea naranja de 2px abajo
- Inactivo: texto `colors.textSecondary`, sin línea

**Estilos clave:**
```ts
tabBar: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
  marginTop: 20,
},
tab: {
  flex: 1,
  paddingVertical: 12,
  alignItems: 'center',
},
tabActive: {
  borderBottomWidth: 2,
  borderBottomColor: colors.primary,
},
tabText: {
  ...typography.h3,
  color: colors.textSecondary,
},
tabTextActive: {
  color: colors.primary,
},
```

---

### Paso 7A — Lista de ingredientes (tab activo por defecto)

**Qué es:** lista de ingredientes con checkbox a la izquierda y cantidad a la derecha. El checkbox se puede marcar para tachar el ítem.

```
○  Avena                    1 taza
─────────────────────────────────
○  Banana madura            1 grande
─────────────────────────────────
○  Huevos                   2 unidades
```

**Estado local para los checkboxes:**
```tsx
const [checked, setChecked] = useState<Set<string>>(new Set());

function toggleCheck(id: string) {
  setChecked(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
}
```

`Set` es una estructura de datos de JavaScript que guarda valores únicos — ideal para IDs de ingredientes marcados.

**Componentes:**
- `TouchableOpacity` por ítem
- Ícono `radio-button-on` (marcado) / `radio-button-off` (sin marcar)
- `Text` con `textDecorationLine: 'line-through'` cuando está marcado

---

### Paso 7B — Lista de pasos (tab inactivo)

**Qué es:** lista numerada de pasos con badge naranja y texto descriptivo.

```
①  Licuá la avena, banana, huevos, leche,
   vainilla, canela y sal hasta obtener
   una mezcla homogénea.

②  Dejá reposar la mezcla 5 minutos...
```

**Componentes:**
- Badge número: `View` circular naranja + `Text` con el número
- `Text` con el texto del paso

Sin estado local — solo renderiza `recipe.steps` con `.map()`.

---

## Orden de construcción sugerido

| Orden | Paso | Por qué primero |
|---|---|---|
| 1 | Setup + data | Sin datos no hay nada que mostrar |
| 2 | Hero imagen | Define la altura y posición de todo lo demás |
| 3 | Panel de contenido | El contenedor blanco que va encima |
| 4 | Título + badge | Primera info visible |
| 5 | Autor + estrellas | Segunda fila de info |
| 6 | MetaChips | Fila de datos rápidos |
| 7 | Descripción | Solo texto |
| 8 | TabSelector | Controla qué lista se muestra |
| 9 | Lista ingredientes | Tab activo por defecto |
| 10 | Lista pasos | Tab secundario |

---

## Nuevos imports que va a necesitar esta pantalla

```tsx
import { useState } from 'react';                          // estado local (tabs, checkboxes)
import { Image } from 'expo-image';                        // imagen optimizada con caché
import { LinearGradient } from 'expo-linear-gradient';     // degradado sobre el hero
import { useLocalSearchParams } from 'expo-router';        // leer el [id] de la URL
import { useRecipes } from '@/hooks/useRecipes';           // buscar la receta por ID
import { useLikes } from '@/hooks/useLikes';               // estado del botón corazón
```

---

## Patrones nuevos en esta pantalla

| Patrón | Dónde | Para qué |
|---|---|---|
| `[id].tsx` ruta dinámica | Nombre del archivo | Un solo archivo sirve para todas las recetas |
| `useLocalSearchParams` | Setup | Leer el parámetro `id` de la URL |
| `useState` | Tabs, checkboxes | Guardar estado que puede cambiar en pantalla |
| `aspectRatio: 4/3` | Hero image | Altura automática proporcional al ancho |
| `position: 'absolute'` | Botones del hero | Superponer elementos fuera del flujo normal |
| `Set` para checkboxes | Lista ingredientes | Estructura eficiente para IDs marcados |
| `.map()` para listas | Ingredientes, pasos | Renderizar una lista de datos dinámicamente |
| `textDecorationLine: 'line-through'` | Ingrediente marcado | Tachar texto con CSS nativo |
| `flexShrink: 0` | Badge dificultad | Evitar que el badge se comprima por un título largo |
| `gap` entre elementos | MetaChips, stars | Espaciado uniforme sin margin en cada hijo |
