const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ─── Helpers de fetch ────────────────────────────────────────────────────────

// Peticiones JSON normales
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/api${endpoint}`, { ...options, headers });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({ error: `Error ${response.status}` }));
  if (!response.ok) throw new Error(data.error || data.message || `Error ${response.status}`);
  return data;
};

// Peticiones con FormData (NO poner Content-Type, el navegador gestiona el boundary)
const fetchFormAPI = async (endpoint, formData, method = 'POST') => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/api${endpoint}`, { method, headers, body: formData });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({ error: `Error ${response.status}` }));
  if (!response.ok) throw new Error(data.error || data.message || `Error ${response.status}`);
  return data;
};

// ─── URL pública de imágenes ──────────────────────────────────────────────────
// El backend guarda "uploads/foto.jpg" o "/uploads/foto.jpg"
// → devuelve "https://mi-api.com/uploads/foto.jpg"
export const getImagenUrl = (ruta) => {
  if (!ruta) return null;
  if (ruta.startsWith('http')) return ruta;
  const limpia = ruta.startsWith('/') ? ruta.slice(1) : ruta;
  return `${API_URL}/${limpia}`;
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authAPI = {
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

  actualizarPerfil: (datos) => {
    if (datos.foto instanceof File) {
      const fd = new FormData();
      if (datos.nombre !== undefined) fd.append('nombre', datos.nombre);
      if (datos.email)    fd.append('email',    datos.email);
      if (datos.password) fd.append('password', datos.password);
      fd.append('foto', datos.foto);
      return fetchFormAPI('/auth/perfil', fd, 'PUT');
    }
    return fetchAPI('/auth/perfil', { method: 'PUT', body: JSON.stringify(datos) });
  },
};

// ─── CERVEZAS ─────────────────────────────────────────────────────────────────
export const cervezasAPI = {
  obtener:      ()     => fetchAPI('/cervezas'),
  obtenerPorId: (id)   => fetchAPI(`/cervezas/${id}`),

  crear: (datos) => {
    const fd = new FormData();
    fd.append('nombre',      datos.nombre      || '');
    fd.append('descripcion', datos.descripcion || '');
    fd.append('graduacion',  datos.graduacion  ?? '');
    fd.append('tipo',        datos.tipo        || '');
    if (datos.archivoImagen instanceof File) fd.append('imatge', datos.archivoImagen);
    return fetchFormAPI('/cervezas', fd, 'POST');
  },

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

// ─── VINOS ────────────────────────────────────────────────────────────────────
export const vinosAPI = {
  obtener:      ()     => fetchAPI('/vinos'),
  obtenerPorId: (id)   => fetchAPI(`/vinos/${id}`),

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

// ─── USUARIOS (admin) ─────────────────────────────────────────────────────────
export const usuariosAPI = {
  obtener: () => fetchAPI('/usuaris'),

  // PATCH /api/usuaris/:id/rol — valores válidos: 'usuari' | 'editor' | 'admin'
  actualizarRol: (id, rol) =>
    fetchAPI(`/usuaris/${id}/rol`, {
      method: 'PATCH',
      body: JSON.stringify({ rol }),
    }),

  eliminar: (id) => fetchAPI(`/usuaris/${id}`, { method: 'DELETE' }),
};

// ─── PEDIDOS ──────────────────────────────────────────────────────────────────
export const pedidosAPI = {
  crear: (items, notas = '') =>
    fetchAPI('/pedidos', { method: 'POST', body: JSON.stringify({ items, notas }) }),

  misPedidos: () => fetchAPI('/pedidos/me'),

  // Solo admin
  obtener:      ()   => fetchAPI('/pedidos'),
  obtenerPorId: (id) => fetchAPI(`/pedidos/${id}`),

  // PATCH /api/pedidos/:id/estado — valores válidos: 'pendiente' | 'confirmado' | 'cancelado'
  actualizarEstado: (id, estado) =>
    fetchAPI(`/pedidos/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    }),
};
