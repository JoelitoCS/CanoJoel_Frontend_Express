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

// Helper especifico para peticiones con archivos.
// Aqui NO ponemos Content-Type porque el navegador debe crear el boundary del multipart/form-data.
const fetchFormDataAPI = async (endpoint, formData, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `Error ${response.status}`);
  }

  return response.json();
};

// Convierte los datos del formulario del admin a FormData cuando hay una imagen.
// El backend espera el archivo con el nombre de campo "imatge".
const crearFormDataProducto = (datos) => {
  const formData = new FormData();

  Object.entries(datos).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    // archivoImagen solo existe en el frontend; en la API se manda como "imatge".
    if (key === 'archivoImagen') {
      formData.append('imatge', value);
      return;
    }

    // previewImagen es solo una URL temporal del navegador para mostrar la vista previa.
    if (key === 'previewImagen') return;

    formData.append(key, value);
  });

  return formData;
};

// Decide si hay que enviar multipart/form-data o JSON normal.
const tieneArchivoProducto = (datos) => datos?.archivoImagen instanceof File;

// Quita campos que solo usa React antes de mandar JSON a MongoDB.
const limpiarDatosProducto = (datos) => {
  const { archivoImagen, previewImagen, ...datosLimpios } = datos;
  return datosLimpios;
};

const guardarProducto = (endpoint, method, datos) => {
  if (tieneArchivoProducto(datos)) {
    return fetchFormDataAPI(endpoint, crearFormDataProducto(datos), { method });
  }

  return fetchAPI(endpoint, {
    method,
    body: JSON.stringify(limpiarDatosProducto(datos)),
  });
};

// Auth
export const authAPI = {
  registro: (email, password, nombre, foto) => {
    // Si hay foto, usar FormData; si no, usar JSON
    if (foto) {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('nombre', nombre);
      formData.append('foto', foto);

      return fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        body: formData,
        // NO incluir Content-Type - el navegador lo establece automáticamente
      }).then(r => {
        if (!r.ok) {
          return r.json().then(err => {
            throw new Error(err.error || 'Error en el registro');
          }).catch(e => {
            throw new Error('Error en el registro');
          });
        }
        return r.json();
      }).catch(err => {
        console.error('Error en registro:', err);
        throw err;
      });
    } else {
      // Sin foto, usar JSON
      return fetchAPI('/auth/registro', {
        method: 'POST',
        body: JSON.stringify({ email, password, nombre }),
      });
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
    guardarProducto('/cervezas', 'POST', datos),
  actualizar: (id, datos) =>
    guardarProducto(`/cervezas/${id}`, 'PUT', datos),
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
    guardarProducto('/vinos', 'POST', datos),
  actualizar: (id, datos) =>
    guardarProducto(`/vinos/${id}`, 'PUT', datos),
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
    fetchAPI(`/pedidos/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    }),
};
