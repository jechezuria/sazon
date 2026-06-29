# Pantalla: Crear Receta (flujo 3 pasos)

> Documentación de estudio detallada — cada archivo, línea y concepto explicado.

---

## Estructura del flujo

```
perfil.tsx
  └─ router.push('/crear/detalles')
        └─ router.push('/crear/ingredientes')
              └─ router.push('/crear/pasos')
                    └─ Alert → router.replace('/(tabs)/perfil')
```

Son 3 pantallas secuenciales. Toda la información viaja a través de un **store de módulo** (`recipeFormStore`), no por URL ni por Context.

---

## Archivos involucrados

| Archivo | Rol |
|---|---|
| `store/recipeFormStore.ts` | Estado compartido entre las 3 pantallas |
| `components/atoms/StepperBar.tsx` | Barra de progreso visual 1→2→3 |
| `app/crear/detalles.tsx` | Paso 1: título, foto, categoría, dificultad, tiempo, porciones |
| `app/crear/ingredientes.tsx` | Paso 2: lista dinámica de ingredientes con nombre y cantidad |
| `app/crear/pasos.tsx` | Paso 3: lista dinámica de pasos + botón publicar |

---

## `store/recipeFormStore.ts`

### ¿Por qué un store de módulo?

Cuando navegás entre pantallas con `router.push()`, cada pantalla es un componente nuevo (no comparten estado de React). Las opciones son:

| Opción | Problema |
|---|---|
| Pasar por URL params | Los arrays no se serializan bien en URLs |
| Context de React | Requiere Provider que envuelva el navegador |
| **Store de módulo** ✅ | Variable JS global que vive mientras la app está corriendo |

### Tipos exportados

```ts
export type IngredientDraft = { id: string; name: string; amount: string };
export type StepDraft       = { id: string; description: string };

export type RecipeFormData = {
  imageUri:    string;      // URI de la foto elegida (vacío si no eligió)
  title:       string;      // Nombre de la receta
  description: string;      // Descripción opcional
  category:    Category | ''; // 'Desayuno' | 'Almuerzo' | etc. | ''
  difficulty:  Difficulty | ''; // 'Fácil' | 'Medio' | 'Difícil' | ''
  cookTime:    string;      // '20 min', '1 hora', etc.
  servings:    string;      // '4', '2', etc.
  ingredients: IngredientDraft[];
  steps:       StepDraft[];
};
```

- El `| ''` en category y difficulty representa "no elegido todavía" — el tipo vacío permite inicializar sin valor pero sigue siendo tipado (no `any`).

### INITIAL y el singleton

```ts
const INITIAL: RecipeFormData = {
  imageUri: '', title: '', description: '', category: '', difficulty: '',
  cookTime: '', servings: '',
  ingredients: [{ id: '1', name: '', amount: '' }],
  steps: [{ id: '1', description: '' }],
};

let _data: RecipeFormData = { ...INITIAL };
```

- `_data` es una variable de módulo — existe una sola instancia mientras la app está corriendo.
- El spread `{ ...INITIAL }` crea una **copia**, no una referencia. Si usaras `_data = INITIAL`, al mutar `_data` también mutarías `INITIAL`.

### API del store

```ts
export const recipeFormStore = {
  get:    (): RecipeFormData               => _data,
  update: (patch: Partial<RecipeFormData>) => { _data = { ..._data, ...patch }; },
  reset:  ()                               => { _data = { ...INITIAL }; },
};
```

- `get()` — devuelve el estado actual. No es una copia, es la referencia directa. Solo leer, no mutar.
- `update(patch)` — merge parcial. `Partial<T>` significa que podés pasar solo los campos que cambiaron.
- `reset()` — vuelve al estado inicial. Se llama después de publicar para limpiar el formulario.

### ¿Qué es `Partial<T>`?

TypeScript built-in. Convierte todos los campos de un tipo en opcionales:
```ts
Partial<RecipeFormData> === {
  imageUri?: string;
  title?: string;
  // ... todos opcionales
}
```
Esto permite llamar `update({ title: 'Pollo al horno' })` sin tener que pasar los otros 8 campos.

---

## `components/atoms/StepperBar.tsx`

### Propósito visual

Muestra el progreso del formulario:

```
● ─────── ○ ─────── ○
Detalles  Ingredientes  Pasos
```

Donde ● = activo/hecho, ○ = pendiente.

### Props

```ts
type Props = { current: 1 | 2 | 3 };
```

El tipo `1 | 2 | 3` es una **union literal** — TypeScript solo acepta esos tres valores, no cualquier número.

### Lógica de estados por paso

```ts
const STEPS = ['Detalles', 'Ingredientes', 'Pasos'] as const;

STEPS.map((label, i) => {
  const num    = (i + 1) as 1 | 2 | 3;
  const done   = num < current;   // ya pasó
  const active = num === current; // estoy acá ahora
  // pending = !done && !active (implícito)
})
```

| `current` | Paso 1 | Paso 2 | Paso 3 |
|---|---|---|---|
| `1` | active | pending | pending |
| `2` | done | active | pending |
| `3` | done | done | active |

### Estructura JSX por paso

```tsx
<React.Fragment key={label}>
  {/* Círculo + label */}
  <View style={styles.step}>
    <View style={[styles.circle, done && styles.circleDone, active && styles.circleActive]}>
      {done
        ? <Ionicons name="checkmark" size={12} color={colors.surface} />
        : <Text style={[styles.num, active && styles.numActive]}>{num}</Text>
      }
    </View>
    <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
  </View>

  {/* Línea conectora (solo entre pasos, no después del último) */}
  {i < 2 && (
    <View style={[styles.line, done && styles.lineDone]} />
  )}
</React.Fragment>
```

- `React.Fragment` con `key` porque cada iteración del map devuelve **dos elementos** (el paso y la línea). Sin Fragment necesitarías un View que rompería el layout flex.
- La línea lleva `done` (no `active`) — se pinta verde cuando el paso YA se completó.

### Alineación de la línea (truco de matemática)

```ts
line: {
  flex: 1,       // ocupa todo el espacio horizontal sobrante
  height: 1.5,
  marginTop: 13, // circle_height/2 - line_height/2 = 28/2 - 1.5/2 ≈ 13
},
```

El contenedor usa `alignItems: 'flex-start'` (no `center`). Esto hace que la línea quede arriba por default. El `marginTop: 13` la baja exactamente hasta el centro del círculo de 28px.

---

## `app/crear/detalles.tsx` — Paso 1

### Imports clave

```ts
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Category, Difficulty } from '@/types';
import { recipeFormStore } from '@/store/recipeFormStore';
import { StepperBar } from '@/components/atoms/StepperBar';
```

### Estado

```ts
const saved = recipeFormStore.get();

const [title,        setTitle]        = useState(saved.title);
const [description,  setDescription]  = useState(saved.description);
const [category,     setCategory]     = useState<Category | ''>(saved.category);
const [difficulty,   setDifficulty]   = useState<Difficulty | ''>(saved.difficulty);
const [cookTime,     setCookTime]     = useState(saved.cookTime);
const [servings,     setServings]     = useState(saved.servings);
const [focusedField, setFocusedField] = useState<string | null>(null);
```

- Se inicializa con `recipeFormStore.get()` — si el usuario vuelve atrás desde ingredientes, los campos ya cargados.
- `focusedField` es un string (nombre del campo) o `null`. Permite saber cuál campo está activo para cambiar el color del borde.

### Botón "Siguiente" habilitado

```ts
const canGoNext = !!(title.trim() && category && difficulty && cookTime.trim() && servings.trim());
```

- `!!` convierte cualquier valor truthy/falsy a `boolean`.
- `category` y `difficulty` son strings — si son `''` son falsy, si tienen valor son truthy.
- `trim()` en los strings de texto para evitar que un espacio habilite el botón.

### handleNext

```ts
function handleNext() {
  recipeFormStore.update({ title, description, category, difficulty, cookTime, servings });
  router.push('/crear/ingredientes');
}
```

Primero guarda en el store, luego navega. El orden importa: si navegás primero, el store queda vacío cuando ingredientes lo lea.

### Área de foto (placeholder)

```tsx
<TouchableOpacity style={styles.photoArea} activeOpacity={0.7}>
  <Ionicons name="camera-outline" size={36} color={colors.textMuted} />
  <Text style={styles.photoText}>Agregar foto de la receta</Text>
  <Text style={styles.photoHint}>Tocá para seleccionar</Text>
</TouchableOpacity>
```

```ts
photoArea: {
  height: 152,
  backgroundColor: colors.surface,
  borderRadius: 16,
  borderWidth: 1.5,
  borderColor: colors.border,
  borderStyle: 'dashed',   // ← borde punteado
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  marginBottom: 20,
},
```

`borderStyle: 'dashed'` es el único valor alternativo a `'solid'` que funciona en React Native en iOS y Android.

### Input con focus

```tsx
<TextInput
  style={[styles.input, focusedField === 'title' && styles.inputFocused]}
  onFocus={() => setFocusedField('title')}
  onBlur={() => setFocusedField(null)}
/>
```

```ts
input: {
  height: 48,
  backgroundColor: colors.surface,
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: colors.border,
  paddingHorizontal: 14,
},
inputFocused: {
  borderColor: colors.primaryMid, // ← naranja cuando está activo
},
```

El array en `style` aplica los estilos en orden. Si `inputFocused` está, su `borderColor` sobreescribe el de `input`.

### Pills de categoría (scroll horizontal)

```tsx
<ScrollView horizontal showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.pillRow}
>
  {CATEGORIES.map((cat) => (
    <TouchableOpacity
      key={cat}
      style={[styles.pill, category === cat && styles.pillActive]}
      onPress={() => setCategory(cat)}
    >
      <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>
        {cat}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
```

```ts
pillRow: { paddingBottom: 4, gap: 8 }, // gap entre pills
pill: {
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 9999,         // cápsula perfecta
  backgroundColor: colors.surface,
  borderWidth: 1.5,
  borderColor: colors.border,
},
pillActive: {
  backgroundColor: colors.primary,
  borderColor: colors.primary,
},
```

`borderRadius: 9999` es el truco para hacer una cápsula — un número muy grande hace que los bordes sean siempre un semicírculo perfecto sin importar el tamaño del componente.

### Selector de dificultad (3 botones)

```tsx
<View style={styles.diffRow}>
  {DIFFICULTIES.map((d) => (
    <TouchableOpacity
      key={d}
      style={[styles.diffBtn, difficulty === d && styles.diffBtnActive]}
      onPress={() => setDifficulty(d)}
    >
      <Text style={[styles.diffText, difficulty === d && styles.diffTextActive]}>{d}</Text>
    </TouchableOpacity>
  ))}
</View>
```

```ts
diffRow: { flexDirection: 'row', gap: 8 },
diffBtn: {
  flex: 1,      // cada botón ocupa 1/3 del espacio
  height: 40,
  borderRadius: 10,
  ...
},
diffBtnActive: {
  backgroundColor: colors.primaryLight, // naranja muy claro
  borderColor: colors.primary,
},
```

`flex: 1` en cada botón hace que los 3 se dividan el ancho equitativamente.

### Fila de dos columnas (tiempo + porciones)

```tsx
<View style={styles.twoCol}>
  <View style={[styles.fieldGroup, styles.colItem]}>
    <Text style={styles.fieldLabel}>TIEMPO *</Text>
    <TextInput ... />
  </View>
  <View style={[styles.fieldGroup, styles.colItem]}>
    <Text style={styles.fieldLabel}>PORCIONES *</Text>
    <TextInput keyboardType="number-pad" ... />
  </View>
</View>
```

```ts
twoCol: {
  flexDirection: 'row',
  gap: 12,
  marginBottom: 24,
},
colItem: {
  flex: 1,
  marginBottom: 0, // sobreescribe el marginBottom: 16 de fieldGroup
},
```

**El truco del `marginBottom: 0`**: `fieldGroup` tiene `marginBottom: 16`. Al usar `[styles.fieldGroup, styles.colItem]`, el style array aplica los estilos en orden, por lo que `colItem.marginBottom: 0` sobreescribe al de `fieldGroup`. El espacio entre la fila y lo siguiente lo maneja `twoCol.marginBottom: 24`.

### KeyboardAvoidingView

```tsx
<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    ...
  </ScrollView>
</KeyboardAvoidingView>
```

- En **iOS**: `behavior="padding"` sube el contenido para que el teclado no tape el input.
- En **Android**: el sistema operativo ya maneja esto, `undefined` deja el comportamiento por default.
- `keyboardShouldPersistTaps="handled"` hace que al tocar un botón mientras el teclado está abierto, el tap llegue al botón (no solo cierre el teclado).

---

## `app/crear/ingredientes.tsx` — Paso 2

### Función `newIngredient`

```ts
function newIngredient(): IngredientDraft {
  return { id: Date.now().toString(), name: '', amount: '' };
}
```

`Date.now()` devuelve el timestamp en milisegundos. Como ID es casi único en la práctica (dos clicks simultáneos serían en el mismo ms, muy improbable). Es más simple que un UUID para este caso.

### Estado

```ts
const [ingredients, setIngredients] = useState<IngredientDraft[]>(
  recipeFormStore.get().ingredients
);
```

Se inicializa desde el store — si el usuario vuelve atrás desde pasos, ve los ingredientes que ya cargó.

### Funciones CRUD de ingredientes

```ts
function addIngredient() {
  setIngredients((prev) => [...prev, newIngredient()]);
}

function removeIngredient(id: string) {
  if (ingredients.length === 1) return; // siempre al menos 1
  setIngredients((prev) => prev.filter((i) => i.id !== id));
}

function updateIngredient(id: string, field: 'name' | 'amount', value: string) {
  setIngredients((prev) =>
    prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
  );
}
```

- **`addIngredient`**: usa `prev => [...prev, newItem]` (spread + nuevo elemento). Nunca muta el array existente.
- **`removeIngredient`**: `filter` crea un array nuevo sin el elemento con ese id.
- **`updateIngredient`**: `map` recorre todos. Si el id coincide, crea un objeto nuevo con el campo actualizado (`[field]` es una **computed property key** — permite usar una variable como nombre de propiedad). Si no coincide, retorna el objeto sin cambios.

### `field: 'name' | 'amount'` — union literal como parámetro

```ts
function updateIngredient(id: string, field: 'name' | 'amount', value: string)
```

Esto limita los valores posibles de `field`. TypeScript no va a aceptar `updateIngredient(id, 'descripcion', v)` — error en tiempo de compilación.

### Renderizado de cada fila

```tsx
{ingredients.map((ing, index) => (
  <View key={ing.id} style={styles.row}>

    {/* Badge naranja con número */}
    <View style={styles.numBadge}>
      <Text style={styles.numText}>{index + 1}</Text>
    </View>

    {/* Inputs nombre + cantidad */}
    <View style={styles.inputsGroup}>
      <TextInput style={styles.inputName} ... />    {/* flex: 2 */}
      <TextInput style={styles.inputAmount} ... />  {/* flex: 1 */}
    </View>

    {/* Botón × */}
    <TouchableOpacity
      disabled={ingredients.length === 1}
      style={styles.removeBtn}
    >
      <Ionicons
        name="close-circle"
        color={ingredients.length === 1 ? colors.border : colors.textMuted}
      />
    </TouchableOpacity>

  </View>
))}
```

- `key={ing.id}` — React usa esta key para identificar el elemento en la lista. Si usaras `key={index}`, al eliminar un elemento del medio React podría confundirse.
- `inputName: { flex: 2 }` y `inputAmount: { flex: 1 }` dentro de un `inputsGroup: { flex: 1, flexDirection: 'row' }` — el nombre toma 2/3 del espacio, la cantidad 1/3.
- El botón `×` está `disabled` cuando hay un solo ingrediente — visualmente el ícono se pone del color del borde (casi invisible).

### canGoNext

```ts
const canGoNext = ingredients.some((i) => i.name.trim());
```

`Array.some()` retorna `true` si AL MENOS UN elemento cumple la condición. Basta con que un ingrediente tenga nombre para habilitar el botón.

### handleNext

```ts
function handleNext() {
  recipeFormStore.update({ ingredients });
  router.push('/crear/pasos');
}
```

---

## `app/crear/pasos.tsx` — Paso 3

### Diferencias con ingredientes

| Ingredientes | Pasos |
|---|---|
| 2 inputs por fila (nombre + cantidad) | 1 textarea por fila |
| `alignItems: 'center'` en la fila | `alignItems: 'flex-start'` (el badge se alinea arriba) |
| Badge tiene `marginTop: 0` | Badge tiene `marginTop: 10` para centrar con la primera línea del texto |
| Botón "Siguiente: Pasos →" | Botón "Publicar receta" (verde, con ícono checkmark) |

### `alignItems: 'flex-start'` en la fila de pasos

```ts
row: {
  flexDirection: 'row',
  alignItems: 'flex-start', // ← no 'center'
  gap: 10,
  marginBottom: 12,
},
numBadge: {
  ...
  marginTop: 10, // ← baja el badge para alinearlo con la primera línea del textarea
},
```

El textarea de un paso puede tener múltiples líneas. Si la fila usa `alignItems: 'center'`, el badge quedaría en el medio vertical de todo el textarea (raro visualmente). Con `flex-start`, todo queda arriba y el `marginTop: 10` en el badge lo baja ligeramente para que quede a la altura de la primera línea del texto.

### Textarea de paso

```tsx
<TextInput
  style={styles.inputStep}
  placeholder={`Describí el paso ${index + 1}...`}
  multiline
  textAlignVertical="top"
  value={step.description}
  onChangeText={(v) => updateStep(step.id, v)}
/>
```

```ts
inputStep: {
  flex: 1,
  minHeight: 80,       // alto mínimo, crece con el contenido
  paddingTop: 10,      // espacio interno arriba para el texto
  textAlignVertical: 'top', // solo en Android: alinea el texto arriba (no centrado)
},
```

`textAlignVertical: 'top'` es una prop de React Native **solo para Android**. En iOS el texto multiline ya se alinea arriba automáticamente.

### Botón publicar (verde, con ícono)

```tsx
<TouchableOpacity
  style={[styles.publishBtn, !canPublish && styles.publishBtnDisabled]}
  onPress={handlePublish}
  disabled={!canPublish}
>
  <Ionicons name="checkmark-circle-outline" size={20} color={colors.surface}
    style={{ marginRight: 8 }}
  />
  <Text style={styles.publishBtnText}>Publicar receta</Text>
</TouchableOpacity>
```

```ts
publishBtn: {
  backgroundColor: colors.success, // verde
  borderRadius: 9999,
  height: 52,
  flexDirection: 'row',           // ícono + texto en fila
  alignItems: 'center',
  justifyContent: 'center',
  ...shadows.float,
},
```

### Alert de confirmación

```ts
function handlePublish() {
  recipeFormStore.update({ steps });
  const data = recipeFormStore.get();

  Alert.alert(
    '¡Receta lista!',
    `"${data.title}" fue publicada con ${data.ingredients.length} ingrediente(s) y ${steps.length} paso(s).`,
    [
      {
        text: 'Ver mis recetas',
        onPress: () => {
          recipeFormStore.reset(); // limpia el formulario para la próxima vez
          router.replace('/(tabs)/perfil');
        },
      },
    ]
  );
}
```

- `Alert.alert(título, mensaje, botones[])` — nativo del sistema operativo (se ve diferente en iOS vs Android).
- `router.replace()` (no `push`) — reemplaza la ruta actual en el stack. El usuario no puede volver atrás al flujo de creación con el botón back.
- `recipeFormStore.reset()` — limpia el store para que la próxima vez que abran "Crear receta" empiece vacío.

---

## Flujo completo de navegación

```
Perfil
  ↓ router.push('/crear/detalles')
Detalles [current=1]
  - Llena: título, foto, categoría, dificultad, tiempo, porciones
  - recipeFormStore.update({ title, ... })
  ↓ router.push('/crear/ingredientes')
Ingredientes [current=2]
  - Llena: lista de ingredientes
  - recipeFormStore.update({ ingredients })
  ↓ router.push('/crear/pasos')
Pasos [current=3]
  - Llena: lista de pasos
  - recipeFormStore.update({ steps })
  - Alert de confirmación
  - recipeFormStore.reset()
  ↓ router.replace('/(tabs)/perfil')
Perfil (sin historial de navegación al flujo crear)
```

**¿Por qué `replace` al final?** Si usaras `push`, el stack quedaría:
```
Perfil → Detalles → Ingredientes → Pasos → Perfil
```
El usuario podría apretar back y volver a "Pasos" de una receta ya publicada. Con `replace`, el stack queda:
```
Perfil
```

---

## Tabla de patrones nuevos en este flujo

| Patrón | Dónde se usa | Por qué |
|---|---|---|
| Store de módulo (`let _data`) | `recipeFormStore.ts` | Compartir estado entre pantallas sin Context |
| `Partial<T>` | `recipeFormStore.update()` | Merge parcial de solo los campos que cambiaron |
| Union literal `1 \| 2 \| 3` | `StepperBar` props | TypeScript rechaza valores inválidos en compilación |
| `React.Fragment` con `key` | `StepperBar` | Retornar múltiples elementos en map sin un View extra |
| `marginTop: 13` (línea del stepper) | `StepperBar` | Matemática: circle/2 - line/2 para centrar visualmente |
| `borderStyle: 'dashed'` | `photoArea` en detalles | Borde punteado para indicar zona de drop/upload |
| `borderRadius: 9999` | Pills, botones | Cápsula perfecta independiente del tamaño |
| `computed property key` (`[field]`) | `updateIngredient` | Actualizar una propiedad de objeto usando variable como nombre |
| `Date.now().toString()` | `newIngredient`, `newStep` | ID rápido y casi único sin librería UUID |
| `Array.some()` | `canGoNext`, `canPublish` | Al menos un elemento cumple la condición |
| `flex: 2` vs `flex: 1` | `inputsGroup` ingredientes | Divide el espacio 2/3 y 1/3 |
| `alignItems: 'flex-start'` + `marginTop` en badge | `pasos.tsx` | Alinear el badge con la primera línea de un textarea multiline |
| `textAlignVertical: 'top'` | `inputStep` | Solo Android: texto arriba en inputs multiline |
| `router.replace()` | Fin del flujo | Elimina el historial de creación para no poder "volver" |
| `Alert.alert(title, msg, buttons[])` | `handlePublish` | Diálogo nativo del OS para confirmar acciones |
| `recipeFormStore.reset()` | Post-publicación | Limpia el store para la próxima creación |
| `disabled={length === 1}` en × | Ambas listas | Siempre mínimo 1 elemento en la lista |
| `key={ing.id}` (no `key={index}`) | Listas dinámicas | Permite eliminar del medio sin que React confunda elementos |
