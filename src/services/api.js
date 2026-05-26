const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('🌐 [API.JS] API_URL:', API_URL);

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

  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    let errorMessage = `Error ${response.status}`;
    try {
      const json = JSON.parse(errorBody);
      errorMessage = json.error || json.message || errorMessage;
    } catch {
      if (errorBody) errorMessage = errorBody;
      else if (response.statusText) errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Auth
export const authAPI = {
  registro: async (email, password, nombre, foto) => {
    try {
      console.log('📤 [authAPI.registro] Enviando registro...');
      console.log('  📧 Email:', email);
      console.log('  📝 Nombre:', nombre);
      console.log('  📸 Foto:', foto ? `${foto.name} (${foto.size} bytes)` : 'Sin foto');

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('nombre', nombre);
      if (foto) formData.append('foto', foto);

      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const url = `${API_URL}/api/auth/registro`;
      console.log('📨 POST:', url);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers,
      });

      console.log('📊 Status:', response.status);
      const data = await response.json();
      console.log('📦 Response:', data);

      if (!response.ok) {
        console.error('❌ Error:', data);
        throw new Error(data.error || `Error ${response.status}`);
      }

      console.log('✅ Registro exitoso');
      return data;
    } catch (err) {
      console.error('❌ [authAPI.registro]:', err.message);
      throw err;
    }
  },

  login: (email, password) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  perfil: () => fetchAPI('/auth/perfil'),

  actualizarPerfil: async (datos) => {
    if (datos.foto instanceof File) {
      const formData = new FormData();
      if (datos.nombre) formData.append('nombre', datos.nombre);
      if (datos.email) formData.append('email', datos.email);
      if (datos.password) formData.append('password', datos.password);
      formData.append('foto', datos.foto);

      const url = `${API_URL}/api/auth/perfil`;
      const headers = {};
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(url, {
        method: 'PUT',
        body: formData,
        headers,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `Error ${response.status}`);
      }

      return data;
    }

    return fetchAPI('/auth/perfil', {
      method: 'PUT',
      body: JSON.stringify(datos),
    });
  },
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

    return fetch(`${API_URL}/api/cervezas/${id}/imatge`, {
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

    return fetch(`${API_URL}/api/vinos/${id}/imatge`, {
      method: 'PATCH',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(r => r.json());
  },
};

// Usuarios
export const usuariosAPI = {
  obtener: () => fetchAPI('/usuaris'),
  actualizarRol: (id, rol) =>
    fetchAPI(`/usuaris/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ rol }),
    }),
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
  actualizarEstado: (id, estado) =>
    fetchAPI(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    }),
};
