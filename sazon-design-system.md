# Sazón — Sistema de Diseño & Arquitectura
**App de recetas en Expo React Native**

---

## 1. Tokens de Diseño

### Paleta de colores

```ts
// theme/colors.ts
export const colors = {
  // Primarios
  primary:       '#FF6B35',   // Naranja cálido — CTA, badges, íconos activos
  primaryLight:  '#FFF0EA',   // Fondo chips, cards muted, backgrounds suaves
  primaryMid:    '#FFD4C0',   // Hover states, bordes de inputs con foco

  // Neutros
  bg:            '#FAFAF7',   // Fondo global (crema muy suave)
  surface:       '#FFFFFF',   // Cards, modales, inputs
  border:        '#F0EDE8',   // Separadores, bordes sutiles

  // Texto
  textPrimary:   '#1A1A1A',   // Títulos, texto importante
  textSecondary: '#6B6B6B',   // Subtítulos, metadatos
  textMuted:     '#B0ADA8',   // Placeholders, labels desactivados

  // Sistema
  success:       '#4CAF50',
  error:         '#E53935',
  rating:        '#FFC107',   // Estrellas

  // Overlay (para imágenes)
  overlayDark:   'rgba(0,0,0,0.45)',
  overlayLight:  'rgba(0,0,0,0.15)',
} as const;
```

### Tipografía

```ts
// theme/typography.ts
// Fuente: System font stack (San Francisco en iOS, Roboto en Android)
// Para display se usa fontWeight '800' para impacto visual

export const typography = {
  // Display — títulos de pantalla grandes
  displayXL: { fontSize: 28, fontWeight: '800', lineHeight: 34, letterSpacing: -0.5 },
  displayL:  { fontSize: 22, fontWeight: '700', lineHeight: 28, letterSpacing: -0.3 },

  // Headings — títulos de secciones y cards
  h1: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  h2: { fontSize: 17, fontWeight: '700', lineHeight: 22 },
  h3: { fontSize: 15, fontWeight: '600', lineHeight: 20 },

  // Body
  bodyL:  { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodyM:  { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodyS:  { fontSize: 13, fontWeight: '400', lineHeight: 18 },

  // UI
  label:    { fontSize: 11, fontWeight: '600', lineHeight: 14, letterSpacing: 0.8, textTransform: 'uppercase' },
  caption:  { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  button:   { fontSize: 15, fontWeight: '700', lineHeight: 20 },
  buttonSm: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
} as const;
```

### Espaciado y radios

```ts
// theme/spacing.ts
export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  '3xl': 32,
  '4xl': 40,
} as const;

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  full: 9999,
} as const;
```

### Sombras

```ts
// theme/shadows.ts
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  float: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  nav: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 5,
  },
} as const;
```

---

## 2. Componentes

### Átomicos

#### `<Tag />` — Chip de categoría / dificultad
```tsx
// components/atoms/Tag.tsx
type TagVariant = 'category' | 'difficulty' | 'filter';
type TagSize = 'sm' | 'md';

// Variantes:
// - category: fondo primaryLight, texto primary, sin borde
// - difficulty: "EASY" verde suave, "MEDIUM" amarillo, "HARD" rojo
// - filter: pill seleccionable, activo = primary sólido
```

#### `<IconButton />` — Botón circular de acción
```tsx
// Tamaños: sm (32px), md (40px), lg (48px)
// Variantes: ghost (transparente), surface (blanco+sombra), primary (naranja)
// Íconos: Heart, Bookmark, Share, ArrowLeft, Plus
```

#### `<PrimaryButton />` — CTA principal
```tsx
// Full-width por defecto, altura 52px, radius full, color primary
// Estado loading: spinner blanco centrado
// Variante outline: borde primary, texto primary, fondo transparente
```

#### `<Input />` — Campo de texto
```tsx
// Altura: 48px (single line), auto (multiline)
// Borde: 1.5px border, color border normal / primaryMid en foco
// Label: typography.label arriba, color textSecondary
// Placeholder: color textMuted
```

#### `<StarRating />` — Calificación
```tsx
// Estrellas rellenas (rating) + outline (vacías)
// Color: colors.rating (#FFC107)
// Tamaños: sm (12px), md (16px)
// Con texto de reseñas al costado
```

#### `<Avatar />` — Foto de usuario
```tsx
// Sizes: sm (28px), md (36px), lg (56px), xl (80px)
// Fallback: iniciales sobre fondo primaryLight
```

### Moleculares

#### `<RecipeCard />` — Card principal ⭐ Componente signature
```tsx
// components/molecules/RecipeCard.tsx
// VARIANTE FULL (featured/home):
// - Imagen full-bleed con aspect ratio 3:2
// - Gradiente inferior oscuro para legibilidad
// - Chip de categoría superpuesto (esquina top-left)
// - Título blanco bold en overlay
// - Row inferior: avatar + nombre autor | tiempo + porciones
// - Botón de like (heart) esquina top-right, fondo blanco circular
// - borderRadius: 16px
// - Sombra suave

// VARIANTE COMPACT (grilla 2 columnas):
// - Misma estructura pero más compacta
// - Título debajo de la imagen (no en overlay)
// - Sin chip de categoría visible (solo en imagen pequeña)
```

#### `<SectionHeader />` — Encabezado de sección
```tsx
// Row con: título h2 izquierda + "Ver todo" naranja derecha
// Padding horizontal: 16px
```

#### `<CategoryPill />` — Filtro de categoría
```tsx
// Scrollable horizontal, pill shape
// Activo: fondo primary, texto blanco
// Inactivo: fondo surface, texto textSecondary, borde border
// Con emoji de icono opcional
```

#### `<MetaChip />` — Dato de receta (tiempo, porciones)
```tsx
// Ícono + texto en fila
// Fondo primaryLight, borderRadius md
// Tamaño fijo: approx 90px ancho
```

#### `<IngredientRow />` — Fila de ingrediente
```tsx
// Radio button izquierda (tachado al marcar)
// Nombre ingrediente | cantidad derecha
// Separador línea sutil entre filas
```

#### `<StepRow />` — Paso de receta
```tsx
// Número circular naranja (badge) + texto descripción
// Sin separador visible — el espaciado comunica la secuencia
```

#### `<ProfileMenuItem />` — Ítem de menú en perfil
```tsx
// Ícono naranja | Label | Chevron derecha
// Altura: 52px, padding horizontal 16px
// Separador entre ítems del mismo grupo
```

### Organismos

#### `<Navbar />` — Barra de navegación inferior
```tsx
// components/organisms/Navbar.tsx
// 3 tabs: Inicio (home) | Buscar (center/principal) | Perfil
// Buscar: botón central elevado, circular naranja (+), más grande
// Tab activo: ícono naranja + label naranja
// Tab inactivo: ícono gris + sin label
// Fondo blanco, sombra superior sutil
// SafeAreaView padding inferior incluido
```

#### `<RecipeHero />` — Hero de detalle de receta
```tsx
// Imagen full-width, aspect ratio 4:3
// Overlay gradiente bottom-to-top
// Botones flotantes: ← atrás | ♡ like | ⬆ compartir
// Los botones tienen fondo blanco semitransparente
```

#### `<TabSelector />` — Selector Ingredientes / Pasos
```tsx
// Solo 2 tabs (sin Nutrición)
// Tab activo: borde inferior naranja + texto naranja
// Tab inactivo: texto textSecondary
// Fondo surface con sombra o bordes suaves
```

---

## 3. Arquitectura de carpetas

```
sazon/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab navigator (Inicio, Buscar, Perfil)
│   │   ├── index.tsx             # Pantalla: Inicio (Home)
│   │   ├── buscar.tsx            # Pantalla: Buscar / Explorar
│   │   └── perfil.tsx            # Pantalla: Perfil
│   ├── recipe/
│   │   └── [id].tsx              # Pantalla: Detalle de receta
│   ├── likes.tsx                 # Pantalla: Mis Me Gusta
│   ├── crear/
│   │   ├── detalles.tsx          # Paso 1: Detalles
│   │   ├── ingredientes.tsx      # Paso 2: Ingredientes
│   │   └── pasos.tsx             # Paso 3: Pasos + Publicar
│   └── _layout.tsx               # Root layout
│
├── components/
│   ├── atoms/
│   │   ├── Tag.tsx
│   │   ├── IconButton.tsx
│   │   ├── PrimaryButton.tsx
│   │   ├── Input.tsx
│   │   ├── StarRating.tsx
│   │   └── Avatar.tsx
│   ├── molecules/
│   │   ├── RecipeCard.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── CategoryPill.tsx
│   │   ├── MetaChip.tsx
│   │   ├── IngredientRow.tsx
│   │   ├── StepRow.tsx
│   │   └── ProfileMenuItem.tsx
│   └── organisms/
│       ├── Navbar.tsx
│       ├── RecipeHero.tsx
│       └── TabSelector.tsx
│
├── data/
│   └── mockData.ts               # Datos mockeados
│
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── shadows.ts
│
├── hooks/
│   ├── useLikes.ts               # Estado global de likes
│   └── useRecipes.ts             # Filtros y búsqueda local
│
└── types/
    └── index.ts                  # Tipos TypeScript
```

---

## 4. Tipos TypeScript

```ts
// types/index.ts

export type Category =
  | 'Desayuno'
  | 'Almuerzo'
  | 'Cena'
  | 'Postre'
  | 'Snack'
  | 'Vegetariano';

export type Difficulty = 'Fácil' | 'Medio' | 'Difícil';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;  // "1½ tazas", "2 huevos grandes"
}

export interface Step {
  id: string;
  order: number;
  description: string;
}

export interface Author {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: Category;
  difficulty: Difficulty;
  cookTime: string;      // "20 min"
  servings: number;
  rating: number;        // 0–5
  reviewCount: number;
  author: Author;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];        // para búsqueda
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  likedRecipeIds: string[];
  myRecipeIds: string[];
}
```

---

## 5. Datos mockeados

```ts
// data/mockData.ts

export const MOCK_AUTHOR: Author = {
  id: 'user-1',
  name: 'Sofia Chen',
  username: 'sofía',
  avatarUrl: undefined,
};

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'recipe-1',
    title: 'Panqueques de Avena',
    description: 'Panqueques esponjosos y saludables hechos con avena y banana. Ideales para un desayuno nutritivo sin harinas refinadas.',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    category: 'Desayuno',
    difficulty: 'Fácil',
    cookTime: '20 min',
    servings: 4,
    rating: 4.8,
    reviewCount: 342,
    author: MOCK_AUTHOR,
    ingredients: [
      { id: 'i1', name: 'Avena', amount: '1 taza' },
      { id: 'i2', name: 'Banana madura', amount: '1 grande' },
      { id: 'i3', name: 'Huevos', amount: '2 unidades' },
      { id: 'i4', name: 'Leche', amount: '½ taza' },
      { id: 'i5', name: 'Esencia de vainilla', amount: '1 cdta' },
      { id: 'i6', name: 'Canela', amount: '½ cdta' },
      { id: 'i7', name: 'Sal', amount: '1 pizca' },
    ],
    steps: [
      { id: 's1', order: 1, description: 'Licuá la avena, banana, huevos, leche, vainilla, canela y sal hasta obtener una mezcla homogénea.' },
      { id: 's2', order: 2, description: 'Dejá reposar la mezcla 5 minutos mientras calentás una sartén antiadherente a fuego medio.' },
      { id: 's3', order: 3, description: 'Vertí ¼ taza de mezcla por panqueque. Cocinás 2-3 minutos hasta que aparezcan burbujas en la superficie.' },
      { id: 's4', order: 4, description: 'Dás vuelta y cocinás 1-2 minutos más. Repetís con el resto de la mezcla.' },
      { id: 's5', order: 5, description: 'Servís con frutas frescas, miel o mermelada.' },
    ],
    tags: ['desayuno', 'saludable', 'avena', 'panqueques', 'sin gluten'],
    createdAt: '2024-01-15',
  },
  {
    id: 'recipe-2',
    title: 'Mousse de Chocolate',
    description: 'Un postre cremoso y decadente con solo 4 ingredientes. Perfecto para ocasiones especiales o cuando querés darte un gusto.',
    imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800',
    category: 'Postre',
    difficulty: 'Medio',
    cookTime: '40 min',
    servings: 6,
    rating: 4.9,
    reviewCount: 218,
    author: MOCK_AUTHOR,
    ingredients: [
      { id: 'i1', name: 'Chocolate negro (70%)', amount: '200g' },
      { id: 'i2', name: 'Crema de leche', amount: '300ml' },
      { id: 'i3', name: 'Huevos', amount: '3 unidades' },
      { id: 'i4', name: 'Azúcar', amount: '3 cdas' },
    ],
    steps: [
      { id: 's1', order: 1, description: 'Derretís el chocolate a baño maría. Dejás enfriar 5 minutos.' },
      { id: 's2', order: 2, description: 'Batís las yemas con el azúcar hasta blanquear. Incorporás el chocolate tibio.' },
      { id: 's3', order: 3, description: 'Batís las claras a nieve firme. Integrás en dos partes con movimientos envolventes.' },
      { id: 's4', order: 4, description: 'Batís la crema a punto chantilly e incorporás suavemente a la mezcla.' },
      { id: 's5', order: 5, description: 'Distribuís en copas y refrigerás mínimo 3 horas antes de servir.' },
    ],
    tags: ['postre', 'chocolate', 'sin horno', 'fácil', 'mousse'],
    createdAt: '2024-01-20',
  },
  {
    id: 'recipe-3',
    title: 'Bowl Mediterráneo',
    description: 'Un bowl colorido y saciante con vegetales frescos, garbanzos crocantes y salsa de tahini. Vegetariano y lleno de proteínas.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    category: 'Almuerzo',
    difficulty: 'Fácil',
    cookTime: '25 min',
    servings: 2,
    rating: 4.7,
    reviewCount: 156,
    author: { id: 'user-2', name: 'Marco Rizzi', username: 'marco', avatarUrl: undefined },
    ingredients: [
      { id: 'i1', name: 'Quinoa cocida', amount: '1 taza' },
      { id: 'i2', name: 'Garbanzos', amount: '1 lata' },
      { id: 'i3', name: 'Pepino', amount: '1 unidad' },
      { id: 'i4', name: 'Tomates cherry', amount: '200g' },
      { id: 'i5', name: 'Aceitunas negras', amount: '½ taza' },
      { id: 'i6', name: 'Tahini', amount: '3 cdas' },
      { id: 'i7', name: 'Limón', amount: '1 unidad' },
      { id: 'i8', name: 'Ajo', amount: '1 diente' },
    ],
    steps: [
      { id: 's1', order: 1, description: 'Escurrís y secás los garbanzos. Los salteás en sartén con aceite de oliva, pimentón y comino 8-10 minutos hasta dorar.' },
      { id: 's2', order: 2, description: 'Preparás la salsa: mezclás tahini, jugo de limón, ajo rallado y agua hasta obtener consistencia cremosa.' },
      { id: 's3', order: 3, description: 'Cortás el pepino en medias lunas y los tomates cherry al medio.' },
      { id: 's4', order: 4, description: 'Armás el bowl: base de quinoa, vegetales frescos, garbanzos crocantes y aceitunas.' },
      { id: 's5', order: 5, description: 'Regás con salsa de tahini y servís inmediatamente.' },
    ],
    tags: ['almuerzo', 'vegetariano', 'saludable', 'bowl', 'mediterráneo'],
    createdAt: '2024-01-22',
  },
  {
    id: 'recipe-4',
    title: 'Pasta Carbonara Clásica',
    description: 'La auténtica receta romana. Sin crema, solo huevos, queso pecorino, guanciale y pimienta negra. Cremosa y perfecta.',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    category: 'Cena',
    difficulty: 'Medio',
    cookTime: '30 min',
    servings: 2,
    rating: 4.9,
    reviewCount: 498,
    author: { id: 'user-2', name: 'Marco Rizzi', username: 'marco', avatarUrl: undefined },
    ingredients: [
      { id: 'i1', name: 'Spaghetti', amount: '200g' },
      { id: 'i2', name: 'Guanciale o panceta', amount: '100g' },
      { id: 'i3', name: 'Yemas de huevo', amount: '3 unidades' },
      { id: 'i4', name: 'Queso pecorino rallado', amount: '60g' },
      { id: 'i5', name: 'Pimienta negra molida', amount: 'Al gusto' },
      { id: 'i6', name: 'Sal', amount: 'Para el agua' },
    ],
    steps: [
      { id: 's1', order: 1, description: 'Hervís la pasta en agua con bastante sal hasta al dente. Guardás 1 taza de agua de cocción.' },
      { id: 's2', order: 2, description: 'Cortás el guanciale en cubos y lo cocinás en sartén fría a fuego medio hasta que suelte la grasa y quede dorado.' },
      { id: 's3', order: 3, description: 'Mezclás las yemas con el queso rallado y pimienta generosa hasta formar una pasta.' },
      { id: 's4', order: 4, description: 'Apagás el fuego, agregás la pasta a la sartén. Vertís la mezcla de huevo mezclando rápido.' },
      { id: 's5', order: 5, description: 'Agregás agua de cocción de a poco hasta lograr una salsa cremosa y brillante. Servís inmediatamente.' },
    ],
    tags: ['cena', 'pasta', 'italiana', 'carbonara', 'clásica'],
    createdAt: '2024-02-01',
  },
  {
    id: 'recipe-5',
    title: 'Tostada Aguacate',
    description: 'El desayuno moderno por excelencia. Pan de masa madre, palta cremosa, huevo poché y semillas. Listo en 10 minutos.',
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=800',
    category: 'Desayuno',
    difficulty: 'Fácil',
    cookTime: '10 min',
    servings: 1,
    rating: 4.5,
    reviewCount: 89,
    author: MOCK_AUTHOR,
    ingredients: [
      { id: 'i1', name: 'Pan de masa madre', amount: '2 rebanadas' },
      { id: 'i2', name: 'Palta madura', amount: '1 unidad' },
      { id: 'i3', name: 'Huevo', amount: '1 unidad' },
      { id: 'i4', name: 'Jugo de limón', amount: '1 cdta' },
      { id: 'i5', name: 'Semillas de sésamo', amount: '1 cdta' },
      { id: 'i6', name: 'Hojuelas de ají', amount: 'Al gusto' },
      { id: 'i7', name: 'Sal y pimienta', amount: 'Al gusto' },
    ],
    steps: [
      { id: 's1', order: 1, description: 'Tostás el pan hasta que esté dorado y crocante.' },
      { id: 's2', order: 2, description: 'Aplastás la palta con un tenedor, condimentás con limón, sal y pimienta.' },
      { id: 's3', order: 3, description: 'Poché el huevo: hervís agua con un chorrito de vinagre, creás un remolino y volcás el huevo. Cocinás 3 minutos.' },
      { id: 's4', order: 4, description: 'Untás la palta sobre el pan, colocás el huevo encima.' },
      { id: 's5', order: 5, description: 'Decorás con semillas de sésamo y hojuelas de ají. Servís de inmediato.' },
    ],
    tags: ['desayuno', 'palta', 'aguacate', 'tostada', 'rápido', 'saludable'],
    createdAt: '2024-02-05',
  },
];

export const MOCK_USER: UserProfile = {
  id: 'user-1',
  name: 'Sofia Chen',
  username: 'sofía',
  email: 'sofia@sazon.app',
  avatarUrl: undefined,
  bio: 'Cocinera apasionada 🍳 Comparto lo que cocino con amor.',
  likedRecipeIds: ['recipe-1', 'recipe-2'],
  myRecipeIds: ['recipe-1', 'recipe-2', 'recipe-5'],
};
```

---

## 6. Pantallas — Descripción detallada

### 🏠 Inicio (`/`)
- Header: "Buenos días 🔥 / ¿Qué vas a cocinar hoy?" + botón `♡ Me gusta` (top-right, va a `/likes`)
- Buscador rápido (decorativo, tap navega a `/buscar`)
- Sección: Categorías (pills scrollables horizontal: Todas, Desayuno, Almuerzo, Cena, Postre, Snack)
- Sección: Destacadas (cards grandes horizontales scrollables, 3:2)
- Sección: Tendencia (grilla 2 columnas, cards compactas)

### 🔍 Buscar (`/buscar`)
- Input de búsqueda activo con ícono lupa y borde naranja
- Pills de filtro rápido: Todo, Rápido, Vegetariano, Popular, Nuevo
- Sección: Búsquedas recientes (lista con ícono reloj)
- Sección: Buscar por ingrediente (pills con emoji)
- Al escribir: reemplaza todo con resultados en grilla 2 col

### 📖 Detalle de Receta (`/recipe/[id]`)
- Hero imagen full-width (4:3)
- Botones flotantes: ← | ♡ | ⬆ (sin guardar/bookmark)
- Panel deslizable: título + badge dificultad + autor + stars
- Chips de metadata: ⏱ tiempo | 👥 porciones (sin calorías)
- Descripción del plato
- TabSelector: `Ingredientes` | `Pasos` (sin Nutrición)
- Tab Ingredientes: listado con checkboxes + "Agregar a lista"
- Tab Pasos: listado numerado con badges naranja

### 👤 Perfil (`/perfil`)
- Avatar grande (80px) centrado + nombre + username
- Bio breve
- Secciones del menú:
  - **MI CUENTA**: Editar perfil, Cambiar contraseña
  - **CONTENIDO**: Mis publicaciones, Crear receta
  - **SESIÓN**: Cerrar sesión (rojo)
- Sin dark mode, idioma, notificaciones, privacidad

### ❤️ Me Gusta (`/likes`)
- Header "Mis Me Gusta"
- Grilla 2 columnas de RecipeCard compact (solo recetas likeadas)
- Estado vacío: ícono corazón + "Todavía no guardaste recetas favoritas"
- Sin tabs Collections/Offline

### ➕ Crear Receta — 3 pasos
**Paso 1: Detalles** (`/crear/detalles`)
- Stepper: Detalles (activo) → Ingredientes → Pasos
- Upload foto (área punteada con ícono cámara)
- Inputs: Título, Descripción, Categoría, Dificultad, Tiempo, Porciones
- CTA: "Siguiente: Ingredientes →"

**Paso 2: Ingredientes** (`/crear/ingredientes`)
- Stepper: Detalles ✓ → Ingredientes (activo) → Pasos
- Lista numerada de inputs: nombre + cantidad, con × para eliminar
- "+ Agregar ingrediente"
- CTA: "Siguiente: Pasos →"

**Paso 3: Pasos** (`/crear/pasos`)
- Stepper: Detalles ✓ → Ingredientes ✓ → Pasos (activo)
- Lista numerada de textareas con × para eliminar
- "+ Agregar paso"
- CTA: "🚀 Publicar receta" (naranja sólido, full-width)

---

## 7. Hooks de estado local (sin backend)

```ts
// hooks/useLikes.ts
// Estado en memoria / AsyncStorage
// likedIds: Set<string>
// toggleLike(id: string) => void
// isLiked(id: string) => boolean

// hooks/useRecipes.ts
// getAll() => Recipe[]
// getById(id: string) => Recipe | undefined
// getByCategory(cat: Category) => Recipe[]
// search(query: string) => Recipe[]   // busca en title + tags + ingredientes
// getLiked(likedIds: string[]) => Recipe[]
// getByAuthor(authorId: string) => Recipe[]
```

---

## 8. Notas de implementación

### Navegación (Expo Router)
- Tab navigator para los 3 tabs principales
- Stack navigator para detalle de receta y flujo crear
- Modal o Stack push para /likes desde el botón del Home

### Imágenes
- `expo-image` para caché y performance
- Imágenes de Unsplash en los mocks (URLs directas)
- Placeholder con color primaryLight mientras carga

### Librerías sugeridas
```json
{
  "expo-image": "para imágenes optimizadas",
  "expo-linear-gradient": "para overlays de cards",
  "@expo/vector-icons": "Feather o Ionicons para íconos",
  "react-native-safe-area-context": "ya incluida en Expo"
}
```

### Accesibilidad
- `accessibilityLabel` en todos los IconButton
- Contraste mínimo 4.5:1 en texto sobre fondos
- `accessibilityRole="button"` en elementos presionables

---

*Sazón v1.0 — Sistema de diseño definido como base para implementación*
