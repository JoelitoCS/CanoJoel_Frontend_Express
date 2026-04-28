# 📚 Documentación Técnica - VinaShop Frontend

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                     React App (Vite)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Router (BrowserRouter)                                 │ │
│  │  ├─ /                    → Home (Catálogo)            │ │
│  │  ├─ /login               → Login                       │ │
│  │  ├─ /registro            → Registro                    │ │
│  │  ├─ /producto/:tipo/:id  → DetalleProducto            │ │
│  │  ├─ /carrito             → Carrito                     │ │
│  │  ├─ /perfil              → Perfil                      │ │
│  │  ├─ /mis-pedidos         → MisPedidos                 │ │
│  │  └─ /admin               → Admin (Solo Admin)         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Contextos Globales                                     │ │
│  │  ├─ AuthContext          (Autenticación)              │ │
│  │  └─ CarritoContext       (Carrito)                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Servicios API (services/api.js)                        │ │
│  │  ├─ authAPI              (Autenticación)              │ │
│  │  ├─ cervezasAPI          (Cervezas)                   │ │
│  │  ├─ vinosAPI             (Vinos)                      │ │
│  │  └─ pedidosAPI           (Pedidos)                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ localStorage                                            │ │
│  │  ├─ token                (JWT)                         │ │
│  │  └─ carrito              (Items del carrito)           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │    Backend API (Express + MongoDB)     │
        │         localhost:3000/api              │
        └─────────────────────────────────────────┘
```

## 📦 Estructura de Carpetas Detallada

### `src/pages/`
Componentes de página (vistas principales).

| Archivo | Descripción | Rutas |
|---------|-------------|--------|
| `Home.jsx` | Catálogo con filtros | `/` |
| `Login.jsx` | Formulario de login | `/login` |
| `Registro.jsx` | Formulario de registro | `/registro` |
| `DetalleProducto.jsx` | Página de producto individual | `/producto/:tipo/:id` |
| `Carrito.jsx` | Carrito y checkout | `/carrito` |
| `Perfil.jsx` | Perfil de usuario | `/perfil` |
| `MisPedidos.jsx` | Historial de pedidos | `/mis-pedidos` |
| `Admin.jsx` | Panel administración | `/admin` |

### `src/components/`
Componentes reutilizables.

| Archivo | Descripción | Props |
|---------|-------------|--------|
| `Navbar.jsx` | Barra de navegación | — |

### `src/context/`
Contextos de React para estado global.

#### `AuthContext.jsx`
Gestión de autenticación y usuario.

**Estado:**
```js
{
  usuario,          // Objeto del usuario logueado
  token,           // JWT token
  cargando,        // Booleano de estado de carga
  error,           // Mensaje de error
  autenticado,     // Booleano
  esAdmin,         // Booleano
  esEditor,        // Booleano
}
```

**Métodos:**
```js
login(email, password)              // Inicia sesión
registro(email, password, nombre, foto) // Registra usuario
logout()                            // Cierra sesión
actualizarUsuario(datos)            // Actualiza usuario
```

#### `CarritoContext.jsx`
Gestión del carrito de compras.

**Estado:**
```js
{
  items: [
    {
      productoId: string,
      nombre: string,
      tipo: 'cerveza' | 'vino',
      cantidad: number
    }
  ]
}
```

**Métodos:**
```js
agregarProducto(producto, cantidad)         // Agrega producto
actualizarCantidad(productoId, tipo, cantidad) // Actualiza cantidad
eliminarProducto(productoId, tipo)          // Elimina producto
vaciarCarrito()                             // Vacía todo el carrito
obtenerTotal()                              // Retorna cantidad de items
```

### `src/services/`
Servicios de API y utilidades.

#### `api.js`
Funciones para comunicarse con el backend.

**Funciones:**
```js
// Auth
authAPI.registro(email, password, nombre, foto)
authAPI.login(email, password)
authAPI.perfil()
authAPI.actualizarPerfil(datos)

// Cervezas
cervezasAPI.obtener()
cervezasAPI.obtenerPorId(id)
cervezasAPI.crear(datos)
cervezasAPI.actualizar(id, datos)
cervezasAPI.eliminar(id)
cervezasAPI.subirImagen(id, archivo)

// Vinos
vinosAPI.obtener()
vinosAPI.obtenerPorId(id)
vinosAPI.crear(datos)
vinosAPI.actualizar(id, datos)
vinosAPI.eliminar(id)
vinosAPI.subirImagen(id, archivo)

// Pedidos
pedidosAPI.crear(items, notas)
pedidosAPI.misPedidos()
pedidosAPI.obtener()
pedidosAPI.obtenerPorId(id)
```

## 🔐 Flujo de Autenticación

```
1. Usuario accede /login o /registro
2. Envía credenciales a backend
3. Backend valida y retorna JWT
4. Frontend guarda token en localStorage
5. Frontend guarda usuario en context
6. Cada petición incluye token en headers
7. Backend valida token
8. Si expira, se pide login nuevamente
```

## 🛒 Flujo del Carrito

```
1. Usuario agrega producto en Home
2. CarritoContext actualiza items
3. localStorage se sincroniza
4. Badge de carrito actualiza (Navbar)
5. Usuario va a /carrito
6. Ve todos sus items
7. Puede actualizar cantidades
8. Confirma pedido
9. pedidosAPI.crear() envía items al backend
10. Carrito se vacía
11. Redirecciona a /mis-pedidos
```

## 🎨 Paleta de Colores y Componentes

### Colores Base (Tailwind)
```
Primary: from-purple-600 to-blue-600
Success: bg-green-500, text-green-700
Error: bg-red-500, text-red-700
Warning: bg-yellow-500, text-yellow-700
Info: bg-blue-500, text-blue-700
```

### Estilos Recurrentes
```css
/* Botones primarios */
bg-gradient-to-r from-purple-600 to-blue-600
hover:from-purple-700 hover:to-blue-700

/* Inputs */
border border-gray-300
focus:border-purple-500
focus:outline-none

/* Cards */
bg-white rounded-lg shadow-lg
hover:shadow-xl transition

/* Títulos */
text-4xl font-bold text-gray-800

/* Descriptivos */
text-gray-600 text-sm
```

## 🚀 Optimizaciones Implementadas

1. **Lazy Loading:** React Router usa code-splitting
2. **localStorage:** Carrito y token persisten
3. **Memoización:** useCallback en contextos
4. **Validación:** Frontend y backend
5. **Error Handling:** Try-catch y estados de error
6. **Responsive:** Mobile-first design
7. **Accesibilidad:** Labels, alt text, etc.

## 🔄 Ciclo de Vida de Componentes

### Home.jsx
```
componentDidMount
├─ Cargar cervezas
├─ Cargar vinos
└─ Renderizar grid

componentDidUpdate([filtro])
└─ Re-renderizar si cambia filtro
```

### Admin.jsx
```
componentDidMount
├─ Verificar si es admin
├─ Cargar datos según seccion
└─ Renderizar tabs

componentDidUpdate([seccion])
└─ Recargar datos al cambiar tab
```

## 📡 Llamadas API Típicas

### GET /api/cervezas
```js
const cervezas = await cervezasAPI.obtener()
// Retorna: Array de cervezas
```

### POST /api/pedidos
```js
const pedido = await pedidosAPI.crear([
  { productoId, nombre, tipo, cantidad }
], "Notas del pedido")
// Retorna: Objeto pedido creado
```

### PUT /api/auth/perfil
```js
const usuario = await authAPI.actualizarPerfil({
  nombre: 'Nuevo nombre',
  email: 'nuevo@email.com',
  password: 'nueva_contraseña'
})
// Retorna: Usuario actualizado
```

## 🧪 Testing

### Cosas a Verificar
1. ✅ Registro y login funcionan
2. ✅ Token persiste en localStorage
3. ✅ Carrito persiste en localStorage
4. ✅ Admin solo accesible para admins
5. ✅ Catálogo carga productos
6. ✅ Carrito suma cantidad correcta
7. ✅ Pedidos se crean correctamente
8. ✅ Perfil se actualiza
9. ✅ Responsive en móvil

## 🐛 Debugging

### Chrome DevTools
1. **Console:** Ver errores de JS
2. **Network:** Ver peticiones API
3. **Storage:** Ver localStorage/sessionStorage
4. **React DevTools:** Inspeccionar componentes

### Comandos útiles
```js
// En consola
localStorage.getItem('token')        // Ver token
localStorage.getItem('carrito')      // Ver carrito
localStorage.clear()                 // Limpiar todo
```

## 📝 Consideraciones de Seguridad

1. **JWT en localStorage:** Básico pero suficiente para esta app
2. **CORS:** Configurado en backend
3. **Validación:** Frontend y backend
4. **Sanitización:** Inputs validados
5. **Contraseñas:** Hasheadas en backend (bcrypt)

---

**Documentación Actualizada: 2024**
