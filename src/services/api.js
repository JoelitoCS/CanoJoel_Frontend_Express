const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper para peticiones JSON normales
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({ error: `Error ${response.status}` }));
  if (!response.ok) throw new Error(data.error || data.message || `Error ${response.status}`);
  return data;
};

// Helper para peticiones con FormData (NO poner Content-Type, el navegador lo gestiona)
const fetchFormAPI = async (endpoint, formData, method = 'POST') => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/api${endpoint}`, {
    method,
    headers,
    body: formData,
  });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({ error: `Error ${response.status}` }));
  if (!response.ok) throw new Error(data.error || data.message || `Error ${response.status}`);
  return data;
};

// Construye la URL pública de una imagen guardada en el backend
// El backend guarda rutas como: "uploads/foto.jpg" o "/uploads/foto.jpg"
export const getImagenUrl = (ruta) => {
  if (!ruta) return null;
  if (ruta.startsWith('http')) return ruta;
  // Normalizar: quitar barra inicial si la tiene
  const limpia = ruta.startsWith('/') ? ruta.slice(1) : ruta;
  return `${API_URL}/${limpia}`;
};

// ========================
// AUTH
// ========================
export const authAPI = {
  // Registro con foto opcional (multipart/form-data)
  registro: (email, password, nombre, foto) => {
    const fd = new FormData();
    fd.append('email', email);
    fd.append('password', password);
    if (nombre) fd.append('nombre', nombre);
    if (foto instanceof File) fd.append('foto', foto);
    return fetchFormAPI('/auth/registro', fd, 'POST');
  },

  login: (email, password) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  perfil: () => fetchAPI('/auth/perfil'),

  // Actualizar perfil con foto opcional
  actualizarPerfil: (datos) => {
    // Si hay archivo de foto, mandamos FormData
    if (datos.foto instanceof File) {
      const fd = new FormData();
      if (datos.nombre !== undefined) fd.append('nombre', datos.nombre);
      if (datos.email)    fd.append('email', datos.email);
      if (datos.password) fd.append('password', datos.password);
      fd.append('foto', datos.foto);
      return fetchFormAPI('/auth/perfil', fd, 'PUT');
    }
    // Sin foto: JSON normal
    return fetchAPI('/auth/perfil', { method: 'PUT', body: JSON.stringify(datos) });
  },
};

// ========================
// CERVEZAS
// ========================
export const cervezasAPI = {
  obtener: () => fetchAPI('/cervezas'),
  obtenerPorId: (id) => fetchAPI(`/cervezas/${id}`),

  // Crear: acepta imagen opcional con campo "imatge"
  crear: (datos) => {
    const fd = new FormData();
    fd.append('nombre',      datos.nombre      || '');
    fd.append('descripcion', datos.descripcion || '');
    fd.append('graduacion',  datos.graduacion  ?? '');
    fd.append('tipo',        datos.tipo        || '');
    if (datos.archivoImagen instanceof File) fd.append('imatge', datos.archivoImagen);
    return fetchFormAPI('/cervezas', fd, 'POST');
  },

  // Actualizar: acepta imagen opcional
  actualizar: (id, datos) => {
    const fd = new FormData();
    fd.append('nombre',      datos.nombre      || '');
    fd.append('descripcion', datos.descripcion || '');
    fd.append('graduacion',  datos.graduacion  ?? '');
    fd.append('tipo',        datos.tipo        || '');
    if (datos.archivoImagen instanceof File) fd.append('imatge', datos.archivoImagen);
    return fetchFormAPI(`/cervezas/${id}`, fd, 'PUT');
  },

  eliminar: (id) => fetchAPI(`/cervezas/${id}`, { method: 'DELETE' }),
};

// ========================
// VINOS
// ========================
export const vinosAPI = {
  obtener: () => fetchAPI('/vinos'),
  obtenerPorId: (id) => fetchAPI(`/vinos/${id}`),

  crear: (datos) => {
    const fd = new FormData();
    fd.append('nombre',      datos.nombre      || '');
    fd.append('descripcion', datos.descripcion || '');
    fd.append('graduacion',  datos.graduacion  ?? '');
    fd.append('tipo',        datos.tipo        || '');
    if (datos.archivoImagen instanceof File) fd.append('imatge', datos.archivoImagen);
    return fetchFormAPI('/vinos', fd, 'POST');
  },

  actualizar: (id, datos) => {
    const fd = new FormData();
    fd.append('nombre',      datos.nombre      || '');
    fd.append('descripcion', datos.descripcion || '');
    fd.append('graduacion',  datos.graduacion  ?? '');
    fd.append('tipo',        datos.tipo        || '');
    if (datos.archivoImagen instanceof File) fd.append('imatge', datos.archivoImagen);
    return fetchFormAPI(`/vinos/${id}`, fd, 'PUT');
  },

  eliminar: (id) => fetchAPI(`/vinos/${id}`, { method: 'DELETE' }),
};

// ========================
// USUARIOS (admin)
// ========================
export const usuariosAPI = {
  obtener: () => fetchAPI('/usuaris'),

  // PATCH /api/usuaris/:id/rol  — el backend espera { rol } con valores: 'usuari' | 'editor' | 'admin'
  actualizarRol: (id, rol) =>
    fetchAPI(`/usuaris/${id}/rol`, {
      method: 'PATCH',
      body: JSON.stringify({ rol }),
    }),

  eliminar: (id) => fetchAPI(`/usuaris/${id}`, { method: 'DELETE' }),
};

// ========================
// PEDIDOS
// ========================
export const pedidosAPI = {
  crear: (items, notas = '') =>
    fetchAPI('/pedidos', { method: 'POST', body: JSON.stringify({ items, notas }) }),
  misPedidos: () => fetchAPI('/pedidos/me'),
  obtener:    () => fetchAPI('/pedidos'),
  obtenerPorId: (id) => fetchAPI(`/pedidos/${id}`),
};
