# 🎨 Guía Visual de Componentes - VinaShop

## 📱 Navbar (Navegación Principal)

```
┌─────────────────────────────────────────────────────────────┐
│  🍺VinaShop  Inicio  🛒 Carrito(5)  🔧Admin  📋Pedidos     │
│                                    👤Usuario ▼               │
│                                    [Mi Perfil] [Cerrar Sesión]│
└─────────────────────────────────────────────────────────────┘
```

**Características:**
- Logo con emojis
- Links de navegación
- Contador de carrito
- Menú de usuario
- Responsive (hamburguesa en móvil)

---

## 🏠 Home - Catálogo

```
┌─────────────────────────────────────────────────────────────┐
│                   🍺 VinaShop 🍷                             │
│        Las mejores cervezas y vinos seleccionados             │
│                                                               │
│  [Todas] [Cervezas] [Vinos]                                 │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ 🖼️      │  │ 🖼️      │  │ 🖼️      │  │ 🖼️      │    │
│  │ Producto │  │ Producto │  │ Producto │  │ Producto │    │
│  │ Desc...  │  │ Desc...  │  │ Desc...  │  │ Desc...  │    │
│  │ 4.5°     │  │ 12.5°    │  │ 5.2°     │  │ 13°      │    │
│  │[Agregar] │  │[Agregar] │  │[Agregar] │  │[Agregar] │    │
│  │ [Ver]    │  │ [Ver]    │  │ [Ver]    │  │ [Ver]    │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                               │
│  Similar grid para Vinos...                                  │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Filtrar por tipo
- ✅ Ver catálogo
- ✅ Agregar al carrito
- ✅ Ver detalles

---

## 🔍 Detalle de Producto

```
┌─────────────────────────────────────────────────────────────┐
│ ← Volver al catálogo                                         │
│                                                               │
│  Imagen              │  🍺 Nombre del Producto              │
│  ┌──────────────┐   │  [CERVEZA] [4.5°]                    │
│  │              │   │                                        │
│  │   Foto       │   │  Descripción Detallada                │
│  │   Grande     │   │  Lorem ipsum dolor sit amet...       │
│  │              │   │                                        │
│  │              │   │  ┌─────────┐  ┌─────────┐            │
│  │              │   │  │TIPO     │  │GRADUAC. │            │
│  │              │   │  │Lager    │  │4.5%     │            │
│  │              │   │  └─────────┘  └─────────┘            │
│  └──────────────┘   │                                        │
│                     │  Cantidad: − 1 +                       │
│                     │  [🛒 Agregar al Carrito]              │
│                     │  (Envío gratuito >5 productos)        │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Ver imagen
- ✅ Leer descripción completa
- ✅ Ver detalles técnicos
- ✅ Ajustar cantidad
- ✅ Agregar al carrito

---

## 🛒 Carrito

```
┌─────────────────────────────────────────────────────────────┐
│ 🛒 Carrito de Compras                                        │
│                                                               │
│  Productos (2)           │  Resumen (STICKY)                │
│  ┌────────────────────┐  │  ┌──────────────────┐            │
│  │ 🍺 Cerveza X 2   │  │  │ 📦 RESUMEN       │            │
│  │ − 2 + | 🗑️ Eliminar │  │  │ Artículos: 5   │            │
│  ├────────────────────┤  │  │ Productos: 3   │            │
│  │ 🍷 Vino X 3      │  │  │─────────────────│            │
│  │ − 3 + | 🗑️ Eliminar │  │  │ Subtotal: $-    │            │
│  ├────────────────────┤  │  │                 │            │
│  │ 🍺 Cerveza X 1   │  │  │ [✓ Confirmar]  │            │
│  │ − 1 + | 🗑️ Eliminar │  │ [Seguir]        │            │
│  └────────────────────┘  │ [Vaciar]        │            │
│                          └──────────────────┘            │
│  📝 Notas Adicionales                                     │
│  ┌────────────────────┐                                   │
│  │ Instrucciones...  │                                    │
│  └────────────────────┘                                   │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Ver productos
- ✅ Cambiar cantidad
- ✅ Eliminar productos
- ✅ Agregar notas
- ✅ Ver resumen
- ✅ Confirmar pedido

---

## 👤 Perfil de Usuario

```
┌──────────────────────────────────────────────────────────┐
│ 👤 Mi Perfil                                             │
│                                                          │
│ ┌─────────────────┐  ┌────────────────────────────────┐│
│ │  📷 Avatar      │  │ Información de la Cuenta [✏️]  ││
│ │  (24x24px)      │  │                                ││
│ │                 │  │ 👤 Nombre: Joel Sánchez       ││
│ │  Joel Sánchez   │  │ ✉️ Email: joel@email.com     ││
│ │  joel@email.com │  │                                ││
│ │                 │  │ 🔐 Nueva Contraseña (opt.)    ││
│ │ [👤USUARIO]     │  │ [______________________]       ││
│ │ Miembro desde   │  │                                ││
│ │ 12/04/2024      │  │ ℹ️ No puedes cambiar tu rol   ││
│ │                 │  │                                ││
│ │ [📋 Mis Pedidos]│  │ [💾 Guardar Cambios]          ││
│ │ [🚪 Cerrar]     │  │                                ││
│ └─────────────────┘  └────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Ver información
- ✅ Editar nombre/email
- ✅ Cambiar contraseña
- ✅ Ver foto de perfil
- ✅ Ir a pedidos
- ✅ Cerrar sesión

---

## 📋 Mis Pedidos

```
┌─────────────────────────────────────────────────────────────┐
│ 📋 Mis Pedidos                                              │
│                                                               │
│ [Todas (3)] [⏳Pendiente (1)] [✓Confirmado (2)] [✗Cancel(0)] │
│                                                               │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Pedido #A1B2C3D4          [PENDIENTE]                   ││
│ │ 12 de abril de 2024                                      ││
│ │                                                           ││
│ │ Productos:                                                ││
│ │   🍺 Cerveza Premium x2                                  ││
│ │   🍷 Vino Reserva x1                                     ││
│ │                                                           ││
│ │ 📝 Notas: Entregar después de las 6pm                   ││
│ │                                                           ││
│ │ Total: 3 productos  ⏳ Esperando confirmación...         ││
│ └──────────────────────────────────────────────────────────┘│
│                                                               │
│ [Segundo pedido similar...]                                 │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Ver historial de pedidos
- ✅ Filtrar por estado
- ✅ Ver detalles de cada pedido
- ✅ Ver notas y productos
- ✅ Estado visual del pedido

---

## 🔧 Panel Admin

```
┌──────────────────────────────────────────────────────────────┐
│ 🔧 Panel de Administración                                   │
│ Bienvenido, Admin                                            │
│                                                               │
│ [🍺Cervezas] [🍷Vinos] [📋Pedidos]                          │
│                                                               │
│ ┌─ Formulario (STICKY) ─┐  ┌─ Lista de Productos ──────────┐│
│ │ ➕ Crear Cerveza      │  │ ┌─────────────┐ ┌─────────────┐││
│ │                       │  │ │ Cerveza 1   │ │ Cerveza 2   │││
│ │ Nombre: [_______]    │  │ │ IPA 6.5°    │ │ Lager 4.2°  │││
│ │ Desc: [___________]  │  │ │ Lorem...    │ │ Lorem...    │││
│ │ Grad: [___] °        │  │ │ [✏️] [🗑️]  │ │ [✏️] [🗑️]  │││
│ │ Tipo: [_______]      │  │ │ └─────────────┘ └─────────────┘││
│ │                       │  │ Similar para más cervezas...    │
│ │ [✓ Crear]           │  │                                   │
│ └───────────────────────┘  └─────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ CRUD de cervezas
- ✅ CRUD de vinos
- ✅ Ver todos los pedidos
- ✅ Cambiar estados
- ✅ Edición inline

---

## 🔐 Login

```
┌─────────────────────────────────────────────────┐
│                  Bienvenido                      │
│                   🍺🍷                           │
│               Inicia sesión en VinaShop           │
│                                                   │
│  Email: [___________________________]           │
│  Contraseña: [___________________________]      │
│                                                   │
│  [Iniciar Sesión]                              │
│                                                   │
│  ¿No tienes cuenta? [Regístrate aquí]          │
│  [← Volver al inicio]                          │
└─────────────────────────────────────────────────┘
```

---

## 📝 Registro

```
┌─────────────────────────────────────────────────┐
│               Crea tu cuenta                     │
│                   🎉                            │
│             Únete a VinaShop hoy                 │
│                                                   │
│  Nombre: [___________________________]          │
│  Email: [___________________________]           │
│  Contraseña: [___________________________]      │
│  Confirmar: [___________________________]       │
│  Foto (Opcional): [Seleccionar archivo]        │
│                                                   │
│  [Registrarse]                                 │
│                                                   │
│  ¿Ya tienes cuenta? [Inicia sesión]            │
│  [← Volver al inicio]                          │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Flujos de Usuario

### Usuario Nuevo
```
Home → [Registrarse] → Registro → Home → Producto → Carrito → Pedido → Mis Pedidos
```

### Usuario Existente
```
Home → [Login] → Home → Producto → Carrito → Pedido → Mis Pedidos → Perfil
```

### Administrador
```
Home → Admin → [CRUD] → Ver Pedidos → Home
```

---

## 🎨 Estilos Visuales

### Colores
```
Primario: Degradado Púrpura → Azul
Fondo: Blanco/Gris claro
Texto: Gris oscuro
Éxito: Verde
Error: Rojo
Warning: Amarillo
```

### Tipografía
```
Títulos: Bold, 2-4xl
Subtítulos: Semibold, 1-2xl
Texto: Regular, sm-base
Labels: Small, semibold
```

### Espaciado
```
Padding: 4-8px (componentes internos)
Margin: 8-16px (entre componentes)
Gap: 16-24px (en grids)
```

---

## 📱 Responsive

### Desktop (lg+)
- Grid de 4 columnas
- Menú completo
- Sidebar sticky

### Tablet (md)
- Grid de 2-3 columnas
- Menú simplificado
- Layout flexible

### Mobile (sm)
- Grid de 1 columna
- Menú hamburguesa
- Full width

---

**¡Ahora entiendes toda la interfaz de VinaShop!** 🎉
