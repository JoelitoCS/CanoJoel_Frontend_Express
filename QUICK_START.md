# Guía Rápida de Uso - VinaShop Frontend

## 🎯 Rutas Disponibles

| Ruta | Descripción | Requerimientos |
|------|-------------|-----------------|
| `/` | Página de inicio / Catálogo | Público |
| `/login` | Iniciar sesión | Público |
| `/registro` | Registrarse | Público |
| `/producto/:tipo/:id` | Detalle de cerveza o vino | Público |
| `/carrito` | Carrito de compras | Público |
| `/perfil` | Mi perfil | Autenticado |
| `/mis-pedidos` | Mis pedidos | Autenticado |
| `/admin` | Panel de administración | Admin |

## 🔑 Variables de Entorno

```env
# URL de la API Backend
VITE_API_URL=http://localhost:3000/api
```

## 🎨 Paleta de Colores

```css
/* Primarios */
--purple: #9333ea → #3b82f6 (gradiente)
--white: #ffffff

/* Secundarios */
--gray-800: #1f2937
--gray-600: #4b5563
--gray-300: #d1d5db

/* Estados */
--success: #10b981 (verde)
--error: #ef4444 (rojo)
--warning: #f59e0b (amarillo)
--info: #3b82f6 (azul)
```

## 🧪 Datos de Prueba

### Usuario Admin
```
Email: admin@example.com
Contraseña: admin123
Rol: admin
```

### Usuario Normal
```
Email: user@example.com
Contraseña: user123
Rol: usuari
```

## 📋 Componentes Principales

### Navbar
- Responsivo (desktop y móvil)
- Menú desplegable para usuario
- Contador de carrito en tiempo real
- Enlaces contextuales según rol

### Home
- Grid de productos (1-4 columnas según pantalla)
- Filtros por tipo (Todas, Cervezas, Vinos)
- Cards de producto con imagen y detalles
- Botones de "Agregar" y "Ver"

### Carrito
- Tabla de productos
- Controles de cantidad (+/-)
- Campo de notas
- Resumen de pedido

### Admin Panel
- Tabs: Cervezas, Vinos, Pedidos
- Formulario lateral para CRUD
- Listado con opciones de editar/eliminar
- Interfaz oscura para comodidad

## 🔄 Flujo de Uso Principal

### 1. Usuario Nuevo
```
Inicio → Registro → Login → Home (Catálogo) → Producto → Carrito → Pedido
```

### 2. Usuario Existente
```
Login → Home → Producto → Carrito → Pedido → Mis Pedidos
```

### 3. Administrador
```
Login → Admin → Gestionar Productos/Pedidos
```

## 🛠️ Funcionalidades Clave

### Autenticación
- Registro con email, contraseña y nombre opcional
- Upload de foto de perfil
- Login seguro con JWT
- Sesión persistente
- Logout

### Catálogo
- Listado de cervezas y vinos
- Búsqueda/filtrado por tipo
- Detalle completo de cada producto
- Graduación alcohólica visible

### Carrito
- Agregar productos múltiples veces
- Actualizar cantidades
- Eliminar productos
- Notas adicionales en pedidos
- Persistencia en localStorage

### Pedidos
- Crear pedidos desde carrito
- Ver historial de pedidos
- Filtrar por estado (pendiente, confirmado, cancelado)
- Detalles de cada pedido

### Administración
- **Cervezas:** Crear, editar, eliminar
- **Vinos:** Crear, editar, eliminar
- **Pedidos:** Ver y monitorear

## 🎯 Tips y Trucos

1. **Guardar Sesión:** Tu sesión se mantiene incluso cerrando la app
2. **Carrito Persistente:** Tus productos se guardan en el carrito
3. **Filtros Rápidos:** Usa los botones en home para filtrar
4. **Modo Admin:** Solo disponible si eres administrador
5. **Responsive:** La app se adapta a cualquier pantalla

## ⚠️ Límites y Consideraciones

- Máx 5MB por imagen de perfil
- Solo JPG, PNG, WebP, GIF como imágenes
- Token expira en 7 días
- Contraseña mínima: 6 caracteres
- Graduación: número decimal (ej: 4.5)

## 🐛 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "API no disponible" | Backend no corre | Inicia el backend en puerto 3000 |
| "Email ya registrado" | Email duplicado | Usa otro email |
| "Credenciales inválidas" | Email/password incorrecto | Verifica tus datos |
| "No autorizado" | Falta token o expiró | Inicia sesión nuevamente |
| "Carrito vacío" | No hay productos | Agrega productos al carrito |

## 📞 Contacto y Soporte

Para reportar issues o sugerencias:
1. Abre un issue en GitHub
2. Describe el problema detalladamente
3. Incluye pasos para reproducir si es posible

---

**¡Disfruta usando VinaShop! 🍺🍷**
