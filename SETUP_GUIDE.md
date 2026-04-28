# 🎯 Guía de Inicio Rápido - VinaShop Frontend

¡Bienvenido! Sigue estos pasos para tener tu frontend funcionando en minutos.

## ⚡ Pasos de Setup (5 minutos)

### Paso 1: Instalar Dependencias
```bash
npm install
```
Esto descargará todas las librerías necesarias (~500MB, depende de tu conexión).

### Paso 2: Configurar Variables de Entorno
Abre `.env` y asegúrate de que apunte a tu backend:

```env
VITE_API_URL=http://localhost:3000/api
```

**Opciones:**
- Local: `http://localhost:3000/api`
- Remoto: `https://tu-api.onrender.com/api`

### Paso 3: Iniciar Frontend
```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

### Paso 4: Iniciar Backend (en otra terminal)
```bash
cd ../CanoJoel_API
npm install
npm run dev
```

Debe correr en http://localhost:3000

## ✅ Verificar que Todo Funciona

1. **¿Se abre la página en localhost:5173?** ✓
2. **¿Puedes registrarte?** Intenta registrarte con un email nuevo
3. **¿Puedes iniciar sesión?** Usa las credenciales que creaste
4. **¿Ves los productos en inicio?** Deberías ver el catálogo
5. **¿Puedes agregar al carrito?** Haz click en "Agregar"

Si todo funciona → ¡Listo! 🎉

## 🐛 Problemas Comunes

### Problema: "Cannot GET /"
**Causa:** Frontend no está iniciado
**Solución:** Asegúrate de ejecutar `npm run dev`

### Problema: "API no disponible"
**Causa:** Backend no está corriendo o URL incorrecta
**Solución:**
1. Abre otra terminal
2. Ve a carpeta del backend
3. Ejecuta `npm run dev`
4. Verifica `.env` tiene URL correcta

### Problema: "Email ya registrado"
**Causa:** Ya usaste ese email
**Solución:** Usa un email diferente o crea otro usuario

### Problema: "Blank page"
**Causa:** Errores de JavaScript
**Solución:**
1. Abre DevTools (F12)
2. Ve a Console
3. Mira el error
4. Lee TECHNICAL_DOCS.md para más info

## 📊 Estructura de Carpetas Rápida

```
CanoJoel_Frontend_Express/
├── src/
│   ├── pages/           ← Las 8 páginas principales
│   ├── components/      ← Navbar y componentes reutilizables
│   ├── context/         ← Autenticación y Carrito
│   ├── services/        ← Llamadas a la API
│   ├── App.jsx          ← Configuración de rutas
│   └── main.jsx         ← Punto de entrada
├── .env                 ← Variables de entorno
└── package.json         ← Dependencias
```

## 🎮 Funcionalidades Disponibles

### 👤 Usuario (No autenticado)
- ✅ Ver catálogo
- ✅ Ver detalles de producto
- ✅ Registrarse
- ✅ Iniciar sesión

### 👥 Usuario (Autenticado)
- ✅ Todas las anteriores
- ✅ Agregar al carrito
- ✅ Crear pedido
- ✅ Ver mis pedidos
- ✅ Editar perfil

### 🔐 Administrador
- ✅ Todas las anteriores
- ✅ Acceso a /admin
- ✅ CRUD de cervezas
- ✅ CRUD de vinos
- ✅ Ver todos los pedidos

## 🎨 Primeras Cosas que Ver

1. **Home (`/`):** Catálogo de productos
2. **Un Producto:** Haz click en "Ver" en cualquier producto
3. **Carrito (`/carrito`):** Prueba agregar y modificar cantidad
4. **Perfil (`/perfil`):** Edita tu información
5. **Admin (`/admin`):** Si eres admin, gestiona productos

## 🚀 Próximos Pasos Opcionales

### Para Desarrollo
1. Instala React DevTools (Chrome/Firefox)
2. Instala Redux DevTools (opcional)
3. Lee TECHNICAL_DOCS.md para entender la arquitectura

### Para Producción
1. Ejecuta `npm run build`
2. Deploy en Vercel, Netlify, etc.
3. Configura `.env` con URL de API remota

### Para Mejoras
1. Lee el código en `src/pages/`
2. Personaliza colores en App.css
3. Agrega nuevas funcionalidades

## 📞 Necesitas Ayuda?

1. Verifica que Backend y Frontend están corriendo
2. Revisa la consola (F12) para errores
3. Lee TECHNICAL_DOCS.md
4. Lee QUICK_START.md
5. Abre un issue en GitHub

## 🎓 Estructura de un Usuario Típico

```
[Usuario Nuevo]
    ↓
[/registro] ← Crea cuenta
    ↓
[/login] ← Inicia sesión
    ↓
[/] ← Ve catálogo
    ↓
[/producto/:id] ← Ve detalles
    ↓
[/carrito] ← Agrega productos y confirma
    ↓
[/mis-pedidos] ← Ve su pedido
    ↓
[/perfil] ← Edita información
    ↓
[/] ← Vuelve a comprar
```

## 🎯 Checklist Final

- [ ] `npm install` completó sin errores
- [ ] `.env` está configurado
- [ ] `npm run dev` abre localhost:5173
- [ ] Backend está en localhost:3000
- [ ] Puedes ver el catálogo
- [ ] Puedes registrarte
- [ ] Puedes agregar al carrito
- [ ] Puedes crear un pedido
- [ ] ¡Todo funciona perfectamente! 🎉

---

**¿Todo bien? ¡A disfrutar de VinaShop! 🍺🍷**
