# Pantalla: Mi Biblioteca (`app/(tabs)/favoritos.tsx`)

Pantalla donde el usuario gestiona sus recetas guardadas, colecciones y contenido offline.

**Referencia visual:** Diseño "Sazón" (Library Grid)  
**Navegación:** Acceso desde la pantalla de **Perfil** > sección **Contenido** > **Mis favoritos**.

---

## Estructura visual

```
SafeAreaView
│
└── [CONTENT WRAPPER]
    ├── Mi Biblioteca (Título)
    │
    ├── [TABS NAVIGATION]
    │     Guardados | Colecciones | Offline
    │     (Indicador naranja inferior)
    │
    └── ScrollView
        └── [GRID DE RECETAS]
              Tarjeta 1  |  Tarjeta 2
              Tarjeta 3  |  ...
```

---

## Lógica de Pestañas (Tabs)

Se utiliza un estado local para controlar qué pestaña está activa:

```tsx
const [activeTab, setActiveTab] = useState('Saved');
```

Al renderizar, se compara el valor activo para aplicar estilos condicionales:
- **Texto:** Si está activa, usa `colors.primary`.
- **Indicador:** Un `View` de 2px de alto que aparece solo debajo de la pestaña seleccionada.

---

## Tarjeta de Receta (`card`)

Es el componente más complejo visualmente. Estructura:

1. **Contenedor de Imagen:** Altura fija (120px) con `overflow: 'hidden'`.
   - **Categoría:** Etiqueta negra semi-transparente en la esquina inferior izquierda.
   - **Favorito:** Círculo blanco con corazón (`🧡`) en la esquina superior derecha.
2. **Información:** 
   - Título con `numberOfLines={2}` para evitar desbordamientos.
   - Fila de pie con autor (avatar circular) y tiempo de cocción (emoji 🕒).

---

## Estilos del Grid

Para lograr la visualización de dos columnas:

```ts
grid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: 16,
},
card: {
  width: '47%', // El 6% restante se reparte en el espacio (gap)
}
```

---

## Patrones de Diseño Reutilizados

- **Fondo:** `colors.bg` para coherencia de marca.
- **Card:** `colors.surface` con sombra sutil (`elevation: 2`) y borde fino (`colors.border`).
- **Avatar:** Un `View` circular pequeño (`avatarCircle`) que actúa como placeholder del usuario.
- **Interactividad:** `activeOpacity={0.9}` en las tarjetas para un feedback suave al presionar.

> **Ubicación:** Esta pantalla se registra en el `_layout.tsx` de la carpeta `(tabs)` con el ícono `heart` de Feather.
