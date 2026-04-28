# VinaShop - Frontend

Frontend moderno y profesional para la aplicación de comercio electrónico de cervezas y vinos, construido con React, Vite y Tailwind CSS.

## 🚀 Características

### Para Usuarios Normales
- 🛍️ Catálogo completo de cervezas y vinos
- 🔍 Filtrado por tipo de bebida
- 🛒 Carrito de compras con persistencia en localStorage
- 📦 Sistema de pedidos con seguimiento
- 👤 Perfil de usuario personalizable
- 🔐 Autenticación segura con JWT

### Para Administradores
- 🔧 Panel de administración completo
- ➕ CRUD de productos (cervezas y vinos)
- 📋 Gestión de pedidos
- 👥 Visualización de usuarios
- 📊 Dashboard con estadísticas

## 📋 Requisitos Previos

- Node.js 16+ instalado
- NPM o Yarn
- Backend API ejecutándose (ver `.env`)

## 🛠️ Instalación

### 1. Clonar o navegar al repositorio
```bash
cd CanoJoel_Frontend_Express
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api
```

Si tu API está en un servidor remoto:
```env
VITE_API_URL=https://tu-api.com/api
```

## 🎯 Ejecución

### Modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### Construir para producción
```bash
npm run build
```

### Vista previa de producción
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── pages/                 # Páginas principales
│   ├── Home.jsx          # Catálogo y página de inicio
│   ├── Login.jsx         # Iniciar sesión
│   ├── Registro.jsx      # Registro de nuevos usuarios
│   ├── DetalleProducto.jsx # Detalle de cerveza/vino
│   ├── Carrito.jsx       # Carrito de compras
│   ├── Perfil.jsx        # Perfil de usuario
│   ├── MisPedidos.jsx    # Historial de pedidos
│   └── Admin.jsx         # Panel de administración
├── components/           # Componentes reutilizables
│   └── Navbar.jsx        # Barra de navegación
├── context/              # Contextos de React
│   ├── AuthContext.jsx   # Gestión de autenticación
│   └── CarritoContext.jsx # Gestión del carrito
├── services/             # Servicios API
│   └── api.js           # Llamadas a la API
├── App.jsx              # Componente principal
├── App.css              # Estilos globales
├── index.css            # Tailwind imports
└── main.jsx             # Punto de entrada
```

## 🎨 Diseño y Estilos

- **Framework CSS:** Tailwind CSS
- **Color Scheme:**
  - Primario: Gradiente Púrpura a Azul
  - Secundario: Blanco y Grises
  - Acentos: Verde (éxito), Rojo (error), Amarillo (advertencia)

## 🔐 Autenticación

- Registra una nueva cuenta o inicia sesión con credenciales existentes
- El token JWT se almacena en localStorage
- Sesión automática verificada al cargar la app
- Soporte para roles: usuario, editor, admin

## 🛒 Sistema de Carrito

- Carrito persistente en localStorage
- Agregar/eliminar/actualizar cantidad de productos
- Crear pedidos desde el carrito
- Seguimiento del estado del pedido

## 👨‍💼 Panel de Administración

Solo accesible para usuarios con rol 'admin'.

### Secciones:
1. **Cervezas:** CRUD completo
2. **Vinos:** CRUD completo
3. **Pedidos:** Visualización y gestión del estado

## 📱 Responsividad

- Diseño totalmente responsive
- Optimizado para móvil, tablet y desktop
- Navegación móvil con menú hamburguesa
- Interfaz adaptativa

## 🔗 Integración con Backend

Todos los endpoints están documentados en `src/services/api.js`:

- **Auth:** Registro, login, perfil
- **Cervezas:** CRUD de cervezas
- **Vinos:** CRUD de vinos
- **Pedidos:** Crear y gestionar pedidos

## 🚨 Solución de Problemas

### "API no disponible"
- Verifica que el backend esté corriendo
- Comprueba la URL en `.env`
- Revisa la consola del navegador para más detalles

### "No se puede crear pedido"
- Asegúrate de estar autenticado
- Verifica que el carrito no esté vacío
- Comprueba los permisos en el backend

### "Estilos no se cargan"
- Ejecuta `npm install` nuevamente
- Limpia la caché: `npm run build`
- Reinicia el servidor de desarrollo

## 📦 Dependencias Principales

- `react` - Librería de UI
- `react-router-dom` - Enrutamiento
- `tailwindcss` - Framework CSS
- `vite` - Build tool

## 🤝 Contribuciones

Para reportar bugs o sugerir mejoras, abre un issue en el repositorio.

## 📝 Licencia

Este proyecto está bajo licencia MIT.

---

**Desarrollado con ❤️ usando React, Tailwind CSS y mucho café ☕**
