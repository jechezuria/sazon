# Pantalla: Buscar (`app/(tabs)/buscar.tsx`)

Pantalla de exploración que permite buscar recetas por texto, filtrar por categorías populares y descubrir ingredientes.

**Referencia visual:** Diseño "Sazón" (Modern Search)  
**Design system:** `colors`, `typography` y espaciados manuales (20, 16, 12).

---

## Estructura visual

```
SafeAreaView
│
├── [HEADER]  ←  fijo, bordes redondeados inferiores
│   ├── Explorar (Título)
│   └── [SEARCH BOX]
│       🔍 + TextInput
│
└── ScrollView
    ├── [SECCIÓN] DESTACADOS
    │     Tarjetas de categoría (Cena rápida, Vegano...)
    │
    ├── [SECCIÓN] POR INGREDIENTE
    │     Scroll horizontal de ingredientes circulares (Palta, Pollo...)
    │
    └── [SECCIÓN] RECIENTES
          Tags horizontales de búsquedas pasadas
```

---

## Imports principales

```tsx
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
```
Tokens de diseño para mantener la coherencia visual con el resto de la aplicación.

| Componente | Uso en esta pantalla |
|---|---|
| `SafeAreaView` | Protege el contenido del notch y la barra inferior. |
| `ScrollView` | Permite el scroll vertical de toda la página y horizontal en ingredientes. |
| `TextInput` | Captura la búsqueda del usuario. |
| `TouchableOpacity` | Usado en filtros, ingredientes y tags para interactividad. |

---

## Secciones Destacadas

### 1. Header con Buscador
Diseñado con el color `surface` (blanco) sobre el fondo `bg` (crema). Tiene una sombra sutil y bordes redondeados de 24px en la parte inferior para separarlo visualmente del contenido scrolleable.

```tsx
<View style={styles.searchBox}>
  <Text>🔍</Text>
  <TextInput ... />
</View>
```

### 2. Cuadrícula de Categorías (`categoryGrid`)
Utiliza `flexDirection: 'row'` y `flexWrap: 'wrap'` para mostrar tarjetas en dos columnas. 

- **Estilo:** Fondo `primaryLight` (naranja suave) y texto `primary` (naranja fuerte).
- **Ancho:** `48%` para dejar un pequeño espacio central.

### 3. Carrusel de Ingredientes
Un `ScrollView` horizontal que rompe el padding lateral de la pantalla para dar una sensación de infinitud.

- **Componente:** `ingredientCircle`.
- **Diseño:** El emoji está centrado en un círculo blanco (`surface`) con borde gris suave.

### 4. Historial Reciente
Usa etiquetas (`historyTag`) compactas en lugar de una lista vertical para ahorrar espacio y facilitar el escaneo visual.

---

## Patrones de Estilo Clave

| Patrón | Valor | Razón |
|---|---|---|
| Fondo de pantalla | `colors.bg` | El tono crema característico de Sazón. |
| Tarjetas | `colors.surface` | El blanco puro hace que el contenido resalte. |
| Bordes redondeados | 16px / 24px | Estilo moderno y amigable. |
| Sombras | `elevation: 3` | Da profundidad al header fijo. |

> **Nota:** Se utilizan emojis nativos (`🔍`, `🌙`, `🥑`) para asegurar la compatibilidad sin dependencias de iconos externos.
