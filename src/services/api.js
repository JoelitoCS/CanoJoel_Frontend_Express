const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper para hacer peticiones
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `Error ${response.status}`);
  }

  return response.json();
};

// Auth
export const authAPI = {
  registro: (email, password, nombre, foto) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('nombre', nombre);
    if (foto) formData.append('foto', foto);

    return fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      body: formData,
    }).then(r => {
      if (!r.ok) throw new Error('Error en el registro');
      return r.json();
    });
  },

  login: (email, password) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  perfil: () => fetchAPI('/auth/perfil'),

  actualizarPerfil: (datos) =>
    fetchAPI('/auth/perfil', {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),
};

// Cervezas
export const cervezasAPI = {
  obtener: () => fetchAPI('/cervezas'),
  obtenerPorId: (id) => fetchAPI(`/cervezas/${id}`),
  crear: (datos) =>
    fetchAPI('/cervezas', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),
  actualizar: (id, datos) =>
    fetchAPI(`/cervezas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),
  eliminar: (id) =>
    fetchAPI(`/cervezas/${id}`, {
      method: 'DELETE',
    }),
  subirImagen: (id, archivo) => {
    const formData = new FormData();
    formData.append('imatge', archivo);

    return fetch(`${API_URL}/cervezas/${id}/imatge`, {
      method: 'PATCH',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(r => r.json());
  },
};

// Vinos
export const vinosAPI = {
  obtener: () => fetchAPI('/vinos'),
  obtenerPorId: (id) => fetchAPI(`/vinos/${id}`),
  crear: (datos) =>
    fetchAPI('/vinos', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),
  actualizar: (id, datos) =>
    fetchAPI(`/vinos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),
  eliminar: (id) =>
    fetchAPI(`/vinos/${id}`, {
      method: 'DELETE',
    }),
  subirImagen: (id, archivo) => {
    const formData = new FormData();
    formData.append('imatge', archivo);

    return fetch(`${API_URL}/vinos/${id}/imatge`, {
      method: 'PATCH',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(r => r.json());
  },
};

// Pedidos
export const pedidosAPI = {
  crear: (items, notas = '') =>
    fetchAPI('/pedidos', {
      method: 'POST',
      body: JSON.stringify({ items, notas }),
    }),
  misPedidos: () => fetchAPI('/pedidos/me'),
  obtener: () => fetchAPI('/pedidos'),
  obtenerPorId: (id) => fetchAPI(`/pedidos/${id}`),
};
