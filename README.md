# VinaShop Frontend

## Resumen

VinaShop es una aplicación frontend profesional para comercio electrónico de cervezas y vinos, construida con React 19, Vite 8 y Tailwind CSS 4.

Incluye:
- Catálogo de cervezas y vinos
- Carrito persistente
- Autenticación con JWT
- Perfil de usuario editable
- Historial de pedidos
- Panel de administración para admins
- Editor de cervezas y vinos para usuarios con rol `editor`

Todos los documentos anteriores se han consolidado en este único README.

---

## Credenciales de prueba

### Admin
- Email: `admin@vinacoteca.com`
- Contraseña: `admin123`
- Rol: `admin`

### Editor
- Email: `editor@vinacoteca.com`
- Contraseña: `editor123`
- Rol: `editor`

> Si tu backend no tiene este usuario creado, registra uno nuevo usando este email y asigna el rol `editor` en la base de datos o mediante el panel de administración.

---

## Rutas principales

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Home / Catálogo | Público |
| `/login` | Login | Público |
| `/registro` | Registro | Público |
| `/producto/:tipo/:id` | Detalle de producto | Público |
| `/carrito` | Carrito | Público |
| `/perfil` | Perfil | Autenticado |
| `/mis-pedidos` | Mis pedidos | Autenticado |
| `/admin` | Panel admin | Admin |
| `/editor` | Editor de cervezas/vinos | Editor |

---

## Instalación rápida

1. Instalar dependencias:
```bash
npm install
```

2. Crear o revisar `.env` en la raíz:
```env
VITE_API_URL=http://localhost:3000/api
```

3. Ejecutar el frontend:
```bash
npm run dev
```

4. Abrir en el navegador:
```text
http://localhost:5173
```

Si trabajas con backend remoto, ajusta `VITE_API_URL` a la URL del servidor.

---

## Scripts útiles

```bash
npm run dev      # Inicia modo desarrollo
npm run build    # Genera build de producción
npm run preview  # Previsualiza build de producción
```

---

## Estructura del proyecto

```
src/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Registro.jsx
│   ├── DetalleProducto.jsx
│   ├── Carrito.jsx
│   ├── Perfil.jsx
│   ├── MisPedidos.jsx
│   ├── Admin.jsx
│   └── Editor.jsx
├── components/
│   └── Navbar.jsx
├── context/
│   ├── AuthContext.jsx
│   └── CarritoContext.jsx
├── services/
│   └── api.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## Principales características

### Usuarios normales
- Registro e inicio de sesión
- Ver catálogo de cervezas y vinos
- Ver detalle de producto
- Agregar productos al carrito
- Guardar carrito en localStorage
- Realizar pedidos
- Ver historial de pedidos
- Editar perfil

### Admin
- Acceso a `/admin`
- CRUD de cervezas
- CRUD de vinos
- Gestión de pedidos
- Gestión básica de usuarios/roles (si el backend lo soporta)

### Editor
- Acceso a `/editor` solo para usuarios con rol `editor`
- Crear y editar cervezas
- Crear y editar vinos
- Subir fotos de productos

---

## Endpoints principales utilizados

- `POST /api/auth/registro`
- `POST /api/auth/login`
- `GET /api/auth/perfil`
- `PUT /api/auth/perfil`
- `GET /api/cervezas`
- `GET /api/cervezas/:id`
- `POST /api/cervezas`
- `PUT /api/cervezas/:id`
- `DELETE /api/cervezas/:id`
- `GET /api/vinos`
- `GET /api/vinos/:id`
- `POST /api/vinos`
- `PUT /api/vinos/:id`
- `DELETE /api/vinos/:id`
- `PATCH /api/cervezas/:id/imatge`
- `PATCH /api/vinos/:id/imatge`
- `POST /api/pedidos`
- `GET /api/pedidos/me`
- `GET /api/pedidos`
- `GET /api/pedidos/:id`
- `GET /api/usuaris`
- `PUT /api/usuaris/:id`

---

## Variables de entorno

- `VITE_API_URL` — URL base del backend con `/api` al final.

Ejemplo local:
```env
VITE_API_URL=http://localhost:3000/api
```

Ejemplo remoto:
```env
VITE_API_URL=https://mi-backend.com/api
```

---

## Notas importantes

- El frontend depende de un backend activo y de que los endpoints esperados existan.
- Si `/api/usuaris` no existe, la sección de usuarios de admin mostrará un mensaje de error.
- El JWT token se guarda en `localStorage`.
- El carrito se sincroniza con `localStorage`.

---

## Problemas comunes y soluciones

### No carga el backend
- Verifica que el backend esté ejecutándose.
- Revisa `VITE_API_URL` en `.env`.
- Abre DevTools > Network para ver la URL de la petición.

### No aparece el panel admin
- Inicia sesión con un usuario admin.
- El enlace `/admin` solo aparece para `admin`.

### No aparece el panel editor
- Inicia sesión con un usuario `editor`.
- El enlace `/editor` solo aparece para `editor`.

### No carga la sección usuarios
- El backend debe ofrecer `GET /api/usuaris` y `PUT /api/usuaris/:id`.

---

## Dependencias principales

- `react`
- `react-dom`
- `react-router-dom`
- `tailwindcss`
- `vite`
- `@vitejs/plugin-react`

---

## Estado del proyecto

- Páginas: 8
- Roles soportados: `user`, `editor`, `admin`
- CRUD de cervezas y vinos
- Pedidos y carrito
- Autenticación JWT
- Interfaz responsive y moderna

---

## Documentación

Este README reemplaza las guías anteriores; ya no se requieren los archivos adicionales de documentación.

**¡Listo!**