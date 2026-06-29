# Sazón — Registro de aprendizaje

Este archivo documenta qué hace cada parte del código que vamos construyendo, con explicaciones para estudiar y practicar.

---

## Estructura general del proyecto

```
sazon/
├── app/              → Pantallas (Expo Router las convierte en rutas automáticamente)
├── components/       → Piezas de UI reutilizables (atoms, molecules, organisms)
├── theme/            → Tokens de diseño: colores, tipografía, espaciado, sombras
├── types/            → Tipos TypeScript compartidos por toda la app
├── data/             → Datos de prueba (mock data)
└── hooks/            → Lógica reutilizable (likes, búsqueda)
```

**¿Por qué esta estructura?**
Separar UI, lógica y datos hace que cada archivo tenga una sola responsabilidad. Si mañana cambia el color primario, solo tocás `theme/colors.ts`. Si cambia la fuente de datos, solo tocás `data/mockData.ts`.

---

## `theme/` — Tokens de diseño

### `theme/colors.ts`
Define todos los colores de la app como constantes con nombre.

```ts
export const colors = {
  primary: '#FF6B35',       // Naranja principal — botones, íconos activos
  primaryLight: '#FFF0EA',  // Versión pálida — fondos de chips, badges
  bg: '#FAFAF7',            // Fondo global (crema muy suave, no blanco puro)
  surface: '#FFFFFF',       // Cards, modales, inputs — blanco puro
  border: '#F0EDE8',        // Bordes y separadores — casi invisible
  textPrimary: '#1A1A1A',   // Títulos y texto importante — casi negro
  textSecondary: '#6B6B6B', // Subtítulos y metadatos — gris medio
  textMuted: '#B0ADA8',     // Placeholders y labels inactivos — gris claro
  ...
}
```

**Regla de uso:** Nunca escribir un color hardcodeado como `'#FF6B35'` en un componente. Siempre usar `colors.primary`. Así si el día de mañana querés cambiar el naranja, lo cambiás en un solo lugar.

### `theme/typography.ts`
Define estilos de texto predefinidos (tamaño, peso, altura de línea).

```ts
displayXL: { fontSize: 28, fontWeight: '800', lineHeight: 34 }  // Títulos grandes de pantalla
displayL:  { fontSize: 22, fontWeight: '700', lineHeight: 28 }  // Títulos medianos
bodyS:     { fontSize: 13, fontWeight: '400', lineHeight: 18 }  // Texto pequeño
```

**¿Por qué `fontWeight` como string?** React Native requiere que `fontWeight` sea un string (`'700'`), no un número (`700`).

### `theme/spacing.ts`
Define una escala de espaciado y radios de borde.

```ts
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 }
export const radius  = { sm: 8, md: 12, lg: 16, xl: 20, full: 9999 }
```

**`radius.full: 9999`** — Un número muy grande garantiza que cualquier elemento quede perfectamente redondo sin importar su tamaño. Es el truco estándar para hacer pills y círculos.

---

## `app/(tabs)/index.tsx` — Pantalla de Inicio

### Paso 1: Header

```tsx
// Línea 3
import { SafeAreaView } from 'react-native-safe-area-context';
```
> **¿Por qué no el `SafeAreaView` de `react-native`?**
> El de `react-native` a veces no respeta bien el notch o la Dynamic Island en iOS. El de `react-native-safe-area-context` es más confiable porque lee el tamaño real del área segura del dispositivo.

```tsx
// Línea 10–16
const FRASES = [
  '¿En qué te inspirás hoy?',
  '¿Qué cocinamos hoy?',
  ...
];
```
> Array definido **fuera del componente** para que no se recree en cada render. Si lo ponés adentro de `HomeScreen()`, React lo crearía de cero cada vez que la pantalla se actualice.

```tsx
// Línea 20
const frase = useMemo(() => FRASES[Math.floor(Math.random() * FRASES.length)], []);
```
> `useMemo` guarda el resultado de una función y no lo recalcula a menos que cambien sus dependencias (el `[]` significa "nunca recalcular"). Sin `useMemo`, la frase cambiaría en cada re-render.
> `Math.random() * FRASES.length` genera un número entre 0 y 4.999..., `Math.floor` lo redondea hacia abajo → índice aleatorio entre 0 y 4.

```tsx
// Línea 23
<SafeAreaView style={styles.safe}>
```
> Envuelve toda la pantalla. Agrega automáticamente el padding necesario para que el contenido no quede debajo del notch, la barra de estado o la barra de gestos.

```tsx
// Línea 24
<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
```
> Aunque ahora solo hay un header, ya ponemos `ScrollView` para que cuando agreguemos secciones (categorías, cards, etc.) la pantalla sea scrolleable.
> `showsVerticalScrollIndicator={false}` oculta la barra de scroll gris de la derecha.

```tsx
// Línea 26–39 — Layout del header
<View style={styles.header}>         // Fila: texto izquierda + botón derecha
  <View>
    <Text style={styles.greeting}>¡Hola!</Text>   // Texto pequeño gris arriba
    <Text style={styles.headline}>{frase}</Text>   // Frase grande negra abajo
  </View>
  <Pressable ...>                    // Botón ♡ que navega a /likes
    <Feather name="heart" ... />
  </Pressable>
</View>
```

```tsx
// Estilos del header
header: {
  flexDirection: 'row',          // Pone texto y botón en la misma fila
  justifyContent: 'space-between', // Texto a la izquierda, botón a la derecha
  alignItems: 'flex-start',      // Los alinea por la parte de arriba (no centrado vertical)
}
```

```tsx
greeting: {
  ...typography.bodyS,           // Texto chico (13px)
  color: colors.textSecondary,   // Gris — no compite con el headline
}
headline: {
  ...typography.displayL,        // Texto grande (22px, bold)
  color: colors.textPrimary,     // Casi negro
  maxWidth: 260,                 // Evita que el texto se extienda hasta el botón
}
```

```tsx
likeBtn: {
  width: 44, height: 44,         // 44pt es el tamaño mínimo recomendado por Apple para touch targets
  borderRadius: 22,              // La mitad del ancho/alto → círculo perfecto
  backgroundColor: colors.primary, // Naranja sólido
}
```

---

### Paso 2: Barra de búsqueda

```tsx
// Línea 42–50
<Pressable
  onPress={() => router.push('/buscar')}
  style={styles.searchBar}
>
  <Feather name="search" size={18} color={colors.textMuted} />
  <Text style={styles.searchPlaceholder}>Buscá recetas, ingredientes...</Text>
</Pressable>
```

> **¿Por qué `Pressable` y no `TextInput`?**
> La barra en el Home es **decorativa** — no escribe, no busca. Al tocarla, lleva al usuario a la pantalla de búsqueda `/buscar` donde sí hay un input real. Esto es un patrón común en apps (Instagram, Airbnb) porque permite animar la transición y tener el input siempre enfocado al llegar.

```tsx
searchBar: {
  flexDirection: 'row',       // Ícono y texto en fila
  alignItems: 'center',       // Centrados verticalmente
  gap: spacing.sm,            // Espacio entre ícono y texto (8pt)
  height: 48,                 // Altura estándar para inputs (del design system)
  backgroundColor: colors.surface,  // Blanco
  borderRadius: 12,           // Bordes redondeados suaves
  borderWidth: 1.5,           // Borde sutil
  borderColor: colors.border, // Color borde casi invisible
}
```

---

### Paso 3: Categorías

```tsx
const CATEGORIAS = ['Todas', 'Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Postres'];
```
> Array de strings simples fuera del componente. No necesitamos objetos con emoji ni id porque el label mismo es suficiente como clave y como valor de estado.

```tsx
const [categoriaActiva, setCategoriaActiva] = useState('Todas');
```
> `useState` guarda qué categoría está seleccionada. El valor inicial es `'Todas'`. Cada vez que el usuario toca una pill, llamamos a `setCategoriaActiva(cat)` y React re-renderiza solo las pills afectadas.

```tsx
<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
  {CATEGORIAS.map(cat => (
    <CategoryPill
      key={cat}
      label={cat}
      active={categoriaActiva === cat}   // true solo para la pill seleccionada
      onPress={() => setCategoriaActiva(cat)}
    />
  ))}
</ScrollView>
```
> **`ScrollView` horizontal** — permite scrollear hacia los costados cuando las pills no entran en pantalla. La prop `horizontal` es la que cambia el eje.
> **`.map()`** — itera el array y devuelve un componente por cada elemento. La prop `key` es obligatoria en listas: React la usa internamente para saber qué elementos cambiaroon sin tener que re-renderizar toda la lista.

---

### Paso 5: Grilla de recetas

```tsx
// Cálculo del ancho de cada card
const SCREEN_W = Dimensions.get('window').width;
const CARD_GAP = spacing.md;  // 12pt entre columnas
const CARD_W = (SCREEN_W - spacing.lg * 2 - CARD_GAP) / 2;
```
> Se calcula una sola vez al cargar el módulo (fuera del componente).
> Fórmula: ancho disponible = pantalla − padding izquierdo − padding derecho − gap entre columnas, dividido en 2.
> Pasarlo explícitamente a cada card evita que cada una tenga que calcularlo por su cuenta.

```tsx
const CATEGORIA_MAP: Record<string, Category | null> = {
  'Todas':    null,
  'Desayuno': 'Desayuno',
  'Merienda': 'Snack',    // ← el label del UI no coincide con el tipo
  'Postres':  'Postre',   // ← igual acá
  ...
};
```
> Los labels del UI (`'Merienda'`, `'Postres'`) no coinciden exactamente con los valores del tipo `Category` del modelo de datos (`'Snack'`, `'Postre'`). El mapa hace la conversión en un solo lugar. `null` para "Todas" significa "sin filtro".

```tsx
const recetas = useMemo(() => {
  const catFiltro = CATEGORIA_MAP[categoriaActiva];
  const resultado = catFiltro ? getByCategory(catFiltro) : getAll();
  return resultado.slice(0, 8);
}, [categoriaActiva]);
```
> `useMemo` recalcula las recetas **solo cuando cambia `categoriaActiva`**, no en cada render.
> `getByCategory` filtra el array de mock data. `getAll` devuelve todo.
> `.slice(0, 8)` toma solo los primeros 8 resultados.

```tsx
<View style={styles.grid}>
  {recetas.map(recipe => (
    <RecipeCard key={recipe.id} recipe={recipe} variant="compact" width={CARD_W} ... />
  ))}
</View>
```
> El grid usa `flexDirection: 'row'` + `flexWrap: 'wrap'`. Con `wrap`, cuando los items no caben en una fila se pasan a la siguiente automáticamente — así se forma la grilla de 2 columnas sin necesidad de `FlatList` ni lógica extra.

```tsx
grid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  paddingHorizontal: spacing.lg,
  gap: CARD_GAP,
}
```
> **`gap`** en React Native (disponible desde RN 0.71) funciona igual que en CSS: aplica espacio entre todos los hijos tanto horizontal como verticalmente, sin tener que agregar `marginRight` o `marginBottom` a cada card.

---

### `data/mockData.ts` — Por qué existe y cómo funciona

```ts
export const MOCK_RECIPES: Recipe[] = [ ... ]
```
> Un array de objetos que simulan lo que vendría de una base de datos o API. Usar el tipo `Recipe[]` hace que TypeScript verifique que cada objeto tenga todos los campos obligatorios con el tipo correcto — si te olvidás de un campo, el error aparece en el editor antes de correr la app.

**¿Por qué `export`?** Para poder importarlo desde cualquier otro archivo. El `export` en los datos y el `import` en los hooks mantiene una dirección clara: `pantalla → hook → datos`.

---

### `components/molecules/RecipeCard.tsx` — Ícono de corazón

```tsx
// ❌ Feather solo tiene corazón outline, no relleno
<Feather name="heart" />

// ✅ Ionicons tiene ambas variantes
import { Ionicons } from '@expo/vector-icons';
<Ionicons name={isLiked ? 'heart' : 'heart-outline'} color={colors.error} />
```
> `@expo/vector-icons` agrupa varios sets de íconos (Feather, Ionicons, AntDesign, MaterialIcons, etc.). Cada set tiene su propia colección — si un set no tiene el ícono que necesitás, podés cambiar de set sin instalar nada nuevo.

```tsx
// Botón circular blanco sobre la imagen
compactLike: {
  position: 'absolute',   // Sale del flujo normal, se posiciona sobre la imagen
  top: spacing.sm,
  right: spacing.sm,
  width: 32, height: 32,
  borderRadius: 16,       // Mitad del tamaño → círculo
  backgroundColor: colors.surface,  // Blanco para que contraste sobre la foto
  alignItems: 'center',
  justifyContent: 'center',
}
```
> `position: 'absolute'` saca al elemento del flujo del layout. Se posiciona relativo al ancestro más cercano que tenga `position: 'relative'` (o cualquier posición). Acá el ancestro es la card que tiene `overflow: 'hidden'`, lo que recorta el botón si se sale de los bordes.

---

## `app/(tabs)/buscar.tsx` — Pantalla de Búsqueda

### Paso 1: Header + barra de búsqueda

**¿Por qué esta pantalla es diferente al buscador del Home?**
En el Home la barra es un `Pressable` decorativo — al tocarla te lleva a esta pantalla. Acá es un `TextInput` real donde el usuario escribe, React guarda el texto y lo usa para filtrar recetas.

```tsx
const [query, setQuery] = useState('');
const [focused, setFocused] = useState(false);
const inputRef = useRef<TextInput>(null);
```
> Dos estados independientes:
> - `query` — el texto que escribe el usuario
> - `focused` — si el input está activo o no (para cambiar el estilo del borde)
>
> `useRef` guarda una referencia directa al componente `TextInput`. No es un valor de estado — no provoca re-renders. Sirve para llamar métodos del input desde afuera, como `.focus()`.

```tsx
<Pressable onPress={() => inputRef.current?.focus()} style={[styles.searchBar, focused && styles.searchBarFocused]}>
```
> El `Pressable` externo hace que tocar en cualquier parte de la barra (no solo el input) enfoque el cursor. Sin esto, el usuario tendría que tocar exactamente el texto para activar el teclado.
> `inputRef.current?.focus()` — el `?.` es optional chaining: si `current` es null (el componente no montó todavía), no falla.

```tsx
// Estilo dinámico según el estado focused
style={[styles.searchBar, focused && styles.searchBarFocused]}
```
> React Native acepta arrays de estilos. El último estilo del array gana en caso de conflicto. `focused && styles.searchBarFocused` devuelve el objeto de estilo si `focused` es true, o `false` si no — React Native ignora los valores falsy en el array de estilos.

```tsx
searchBar: {
  borderColor: colors.border,     // Gris por defecto
},
searchBarFocused: {
  borderColor: colors.primary,    // Naranja cuando está activo
  backgroundColor: colors.surface, // Fondo blanco (era crema)
},
```
> El cambio de borde naranja al enfocar le da feedback visual al usuario: "estás escribiendo acá". Es un patrón estándar de UX para inputs.

```tsx
{query.length > 0 && (
  <Pressable onPress={() => setQuery('')} accessibilityLabel="Limpiar búsqueda">
    <Feather name="x" size={16} color={colors.textMuted} />
  </Pressable>
)}
```
> El botón de limpiar (`x`) solo aparece cuando hay texto escrito. `query.length > 0` evalúa a `true` si hay al menos un caracter — el cortocircuito `&&` renderiza el componente solo si la condición es verdadera.

```tsx
<TextInput
  returnKeyType="search"   // Muestra "Buscar" en el teclado en lugar de "Intro"
  autoCorrect={false}      // Evita que corrija ingredientes o nombres propios
/>
```

```tsx
// Header con bordes redondeados abajo
header: {
  backgroundColor: colors.surface,
  borderBottomLeftRadius: radius.xl,   // Solo los bordes inferiores
  borderBottomRightRadius: radius.xl,
  shadowColor: '#000',
  shadowOpacity: 0.05,                 // Sombra muy sutil — solo para separarlo del fondo
  elevation: 3,
}
```
> Redondear solo los bordes inferiores crea el efecto de "card que sale de arriba". Los bordes superiores quedan rectos contra el borde de la pantalla.

---

## Conceptos clave de React Native

### Flexbox en React Native
React Native usa Flexbox para el layout, igual que CSS, pero con diferencias:
- **Por defecto `flexDirection: 'column'`** (en CSS es `row`) — los elementos se apilan verticalmente
- Para poner cosas en fila hay que poner `flexDirection: 'row'` explícitamente
- `justifyContent` controla el eje principal, `alignItems` el eje secundario

### `Pressable` vs `TouchableOpacity` vs `Button`
- `Button` — muy básico, difícil de estilizar
- `TouchableOpacity` — el clásico, reduce la opacidad al presionar
- `Pressable` — el moderno (React Native 0.64+), más flexible, permite estilos distintos según el estado (`pressed`, `focused`, `hovered`)

### `StyleSheet.create()`
```ts
const styles = StyleSheet.create({ ... })
```
No es obligatorio (podés pasar objetos inline), pero tiene ventajas:
1. Valida los estilos en tiempo de desarrollo y muestra errores
2. En producción optimiza los estilos con IDs en lugar de objetos

---

*Este archivo se actualiza con cada paso de la implementación.*
