import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cervezasAPI, vinosAPI, pedidosAPI, usuariosAPI } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Estado base para crear o editar un producto.
// archivoImagen solo vive en React; la API lo recibira como FormData con el nombre "imatge".
const productoInicial = {
  nombre: '',
  descripcion: '',
  graduacion: '',
  tipo: '',
  imagen: '',
  archivoImagen: null,
  previewImagen: '',
};

// Construye el formulario desde un documento de MongoDB sin arrastrar campos internos (_id, __v...).
const productoAFormulario = (producto) => ({
  nombre: producto.nombre || '',
  descripcion: producto.descripcion || '',
  graduacion: producto.graduacion ?? '',
  tipo: producto.tipo || '',
  imagen: producto.imagen || '',
  archivoImagen: null,
  previewImagen: '',
});

// Convierte una ruta relativa guardada en MongoDB en una URL visible en el navegador.
const obtenerImagenUrl = (imagen) => {
  if (!imagen) return '';
  if (imagen.startsWith('http')) return imagen;
  return `${API_URL.replace('/api', '')}/${imagen}`;
};

export default function Admin() {
  const { usuario, autenticado, esAdmin } = useAuth();
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState('cervezas');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cervezas, setCervezas] = useState([]);
  const [formCerveza, setFormCerveza] = useState(productoInicial);
  const [editandoCerveza, setEditandoCerveza] = useState(null);
  const [vinos, setVinos] = useState([]);
  const [formVino, setFormVino] = useState(productoInicial);
  const [editandoVino, setEditandoVino] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [actualizandoUsuario, setActualizandoUsuario] = useState(null);
  const [actualizandoPedido, setActualizandoPedido] = useState(null);

  const cambiarEstadoPedido = async (id, nuevoEstado) => {
    try {
      await pedidosAPI.actualizarEstado(id, nuevoEstado);
      setExito(`Pedido marcado como ${nuevoEstado}`);
      // Actualizar localmente sin recargar todo
      setPedidos((prev) =>
        prev.map((p) => (p._id === id ? { ...p, estado: nuevoEstado } : p))
      );
      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar el estado');
    }
  };

  useEffect(() => {
    if (!autenticado || !esAdmin) {
      navigate('/');
      return;
    }

    cargarDatos();
  }, [autenticado, esAdmin, navigate, seccion]);

  const cargarDatos = async () => {
    setCargando(true);
    setError('');
    try {
      if (seccion === 'cervezas') {
        const data = await cervezasAPI.obtener();
        setCervezas(data?.dades || []);
      } else if (seccion === 'vinos') {
        const data = await vinosAPI.obtener();
        setVinos(data?.dades || []);
      } else if (seccion === 'pedidos') {
        const data = await pedidosAPI.obtener();
        setPedidos(data?.dades || []);
      } else if (seccion === 'usuarios') {
        const data = await usuariosAPI.obtener();
        setUsuarios(data?.dades || []);
      }
    } catch (err) {
      const mensaje = err.message || 'Error al cargar datos';
      if (seccion === 'usuarios' && mensaje.includes('404')) {
        setError('La API de usuarios no está disponible en este backend. Debe exponer GET /api/usuaris y PUT /api/usuaris/:id para que esta sección funcione.');
      } else {
        setError(mensaje);
      }
    } finally {
      setCargando(false);
    }
  };

  const guardarCerveza = async (e) => {
    e.preventDefault();
    const formulario = e.currentTarget;
    if (!formCerveza.nombre || !formCerveza.descripcion || !formCerveza.graduacion || !formCerveza.tipo) {
      setError('Por favor completa todos los campos');
      return;
    }

    setCargando(true);
    setError('');
    try {
      if (editandoCerveza) {
        await cervezasAPI.actualizar(editandoCerveza._id, formCerveza);
        setExito('Cerveza actualizada');
      } else {
        await cervezasAPI.crear(formCerveza);
        setExito('Cerveza creada');
      }
      setFormCerveza({ ...productoInicial });
      setEditandoCerveza(null);
      formulario.reset();
      cargarDatos();
      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const eliminarCerveza = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cerveza?')) {
      try {
        await cervezasAPI.eliminar(id);
        setExito('Cerveza eliminada');
        cargarDatos();
        setTimeout(() => setExito(''), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const guardarVino = async (e) => {
    e.preventDefault();
    const formulario = e.currentTarget;
    if (!formVino.nombre || !formVino.descripcion || !formVino.graduacion || !formVino.tipo) {
      setError('Por favor completa todos los campos');
      return;
    }

    setCargando(true);
    setError('');
    try {
      if (editandoVino) {
        await vinosAPI.actualizar(editandoVino._id, formVino);
        setExito('Vino actualizado');
      } else {
        await vinosAPI.crear(formVino);
        setExito('Vino creado');
      }
      setFormVino({ ...productoInicial });
      setEditandoVino(null);
      formulario.reset();
      cargarDatos();
      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const eliminarVino = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este vino?')) {
      try {
        await vinosAPI.eliminar(id);
        setExito('Vino eliminado');
        cargarDatos();
        setTimeout(() => setExito(''), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const actualizarRol = async (usuarioItem) => {
    if (usuarioItem._id === usuario._id) {
      setError('No puedes cambiar tu propio rol desde aquí.');
      return;
    }

    setActualizandoUsuario(usuarioItem._id);
    setError('');
    try {
      await usuariosAPI.actualizarRol(usuarioItem._id, usuarioItem.rol || 'user');
      setExito('Rol actualizado correctamente.');
      cargarDatos();
      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar el rol');
    } finally {
      setActualizandoUsuario(null);
    }
  };

  const actualizarEstadoPedido = async (pedidoId, estado) => {
    setActualizandoPedido(pedidoId);
    setError('');
    try {
      await pedidosAPI.actualizarEstado(pedidoId, estado);
      setExito(`Pedido ${estado} correctamente.`);
      cargarDatos();
      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError(err.message || `Error al actualizar el pedido a ${estado}`);
    } finally {
      setActualizandoPedido(null);
    }
  };

  const renderFormulario = (titulo, form, setForm, onSubmit, editando, onCancel, placeholderTipo) => (
    <div className="panel-dark rounded-[2rem] p-6 text-[#fff4e6] lg:sticky lg:top-28">
      <h2 className="font-display text-4xl">{titulo}</h2>
      <form key={editando?._id || titulo} onSubmit={onSubmit} className="mt-6 space-y-4">
        {[
          ['Nombre', 'nombre'],
          ['Graduación', 'graduacion'],
          ['Tipo', 'tipo'],
        ].map(([label, key]) => (
          <div key={key}>
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8bb98]">{label}</label>
            <input
              type={key === 'graduacion' ? 'number' : 'text'}
              step={key === 'graduacion' ? '0.1' : undefined}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={key === 'tipo' ? placeholderTipo : ''}
              className="w-full rounded-[1.1rem] border border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.08)] px-4 py-3 outline-none transition focus:border-[#d8bb98]"
            />
          </div>
        ))}

        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8bb98]">Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            rows="4"
            className="w-full rounded-[1.1rem] border border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.08)] px-4 py-3 outline-none transition focus:border-[#d8bb98]"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8bb98]">Foto del producto</label>

          {(form.previewImagen || form.imagen) && (
            <div className="mb-3 overflow-hidden rounded-[1.1rem] border border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.08)]">
              <img
                src={form.previewImagen || obtenerImagenUrl(form.imagen)}
                alt={form.nombre || 'Producto'}
                className="h-40 w-full object-cover"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => {
              // Guardamos el File y una URL temporal para que el admin vea la nueva foto antes de guardar.
              const archivo = e.target.files?.[0] || null;
              const previewImagen = archivo ? URL.createObjectURL(archivo) : '';
              setForm({ ...form, archivoImagen: archivo, previewImagen });
            }}
            className="w-full rounded-[1.1rem] border border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.08)] px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#d8bb98] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#2d201a] focus:border-[#d8bb98]"
          />

          {form.archivoImagen && (
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d8bb98]">
              Nueva foto seleccionada: {form.archivoImagen.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="wood-button w-full rounded-[1.1rem] px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] disabled:opacity-50"
        >
          {cargando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear'}
        </button>

        {editando && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-[1.1rem] border border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.08)] px-4 py-3 text-sm font-bold uppercase tracking-[0.16em]"
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );

  const renderLista = (items, onEdit, onDelete) => (
    <div className="grid gap-4 md:grid-cols-2">
      {cargando ? (
        <p className="text-[#f1decd]">Cargando...</p>
      ) : items.length === 0 ? (
        <div className="panel rounded-[1.8rem] p-8 text-[#6d5040]">No hay elementos.</div>
      ) : (
        items.map((item) => (
          <article key={item._id} className="panel rounded-[1.8rem] p-5">
            <div className="flex gap-4">
              {item.imagen ? (
                <img
                  src={obtenerImagenUrl(item.imagen)}
                  alt={item.nombre}
                  className="h-24 w-24 shrink-0 rounded-[1.1rem] object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.1rem] border border-[rgba(121,88,66,0.14)] bg-[rgba(121,88,66,0.08)] text-center text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#8c684d]">
                  Sin foto
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-display text-3xl text-[#2d201a]">{item.nombre}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-[#5c4335]">{item.descripcion}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm text-[#7a5945]">
              <span>{item.graduacion}°</span>
              <span>{item.tipo}</span>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => onEdit(item)}
                className="wood-button-soft flex-1 rounded-[1rem] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.16em]"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="flex-1 rounded-[1rem] border border-[#d9b7b7] bg-[#fff6f6] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.16em] text-[#8d4a4a]"
              >
                Eliminar
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  );

  return (
    <div className="page-shell bg-[linear-gradient(180deg,rgba(34,24,20,0.96),rgba(20,14,11,0.98))]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <span className="eyebrow border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.08)] text-[#d8bb98]">Panel</span>
          <h1 className="mt-4 font-display text-5xl text-[#fff4e6]">Administración</h1>
          <p className="mt-3 text-[#d6b895]">Bienvenido, {usuario?.nombre || usuario?.email}</p>
        </div>

        {error && <div className="mb-6 rounded-[1.3rem] border border-[#7b3f3f] bg-[#4a2224] px-4 py-3 text-[#ffdada]">{error}</div>}
        {exito && <div className="mb-6 rounded-[1.3rem] border border-[#4d704a] bg-[#243827] px-4 py-3 text-[#daf4d8]">{exito}</div>}

        <div className="mb-8 flex flex-wrap gap-3">
          {['cervezas', 'vinos', 'pedidos', 'usuarios'].map((key) => (
            <button
              key={key}
              onClick={() => setSeccion(key)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.16em] transition ${
                seccion === key
                  ? 'wood-button text-[#fff8ef]'
                  : 'border border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.05)] text-[#f1decd]'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {seccion === 'cervezas' && (
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            {renderFormulario(
              editandoCerveza ? 'Editar cerveza' : 'Crear cerveza',
              formCerveza,
              setFormCerveza,
              guardarCerveza,
              editandoCerveza,
              () => {
                setEditandoCerveza(null);
                setFormCerveza({ ...productoInicial });
              },
              'IPA, Lager, Stout...'
            )}
            {renderLista(
              cervezas,
              (cerveza) => {
                setEditandoCerveza(cerveza);
                setFormCerveza(productoAFormulario(cerveza));
              },
              eliminarCerveza
            )}
          </div>
        )}

        {seccion === 'vinos' && (
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            {renderFormulario(
              editandoVino ? 'Editar vino' : 'Crear vino',
              formVino,
              setFormVino,
              guardarVino,
              editandoVino,
              () => {
                setEditandoVino(null);
                setFormVino({ ...productoInicial });
              },
              'Tinto, Blanco, Rosado...'
            )}
            {renderLista(
              vinos,
              (vino) => {
                setEditandoVino(vino);
                setFormVino(productoAFormulario(vino));
              },
              eliminarVino
            )}
          </div>
        )}

        {seccion === 'usuarios' && (
          <div className="space-y-4">
            {cargando ? (
              <p className="text-[#f1decd]">Cargando...</p>
            ) : usuarios.length === 0 ? (
              <div className="panel rounded-[1.8rem] p-8 text-[#6d5040]">No hay usuarios registrados.</div>
            ) : (
              usuarios.map((usuarioItem) => (
                <article key={usuarioItem._id} className="panel rounded-[1.8rem] p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-display text-3xl text-[#2d201a]">{usuarioItem.nombre || usuarioItem.email}</h3>
                      <p className="mt-2 text-sm text-[#6d5040]">{usuarioItem.email}</p>
                    </div>
                    <span className="rounded-full border border-[rgba(121,88,66,0.14)] bg-[rgba(121,88,66,0.08)] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#7a5945]">
                      {usuarioItem.rol || 'user'}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
                    <select
                      value={usuarioItem.rol || 'user'}
                      onChange={(e) => {
                        const nuevosUsuarios = usuarios.map((u) =>
                          u._id === usuarioItem._id ? { ...u, rol: e.target.value } : u
                        );
                        setUsuarios(nuevosUsuarios);
                      }}
                      disabled={usuarioItem._id === usuario._id}
                      className="w-full rounded-[1.1rem] border border-[#b78c66] bg-[#fff4e0] px-4 py-3 text-[#2d201a] shadow-sm outline-none transition duration-200 focus:border-[#d8bb98] focus:ring-2 focus:ring-[#d8bb98]/40"
                    >
                      <option value="user">Usuario</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => actualizarRol(usuarioItem)}
                      disabled={usuarioItem._id === usuario._id || actualizandoUsuario === usuarioItem._id}
                      className="wood-button-soft rounded-[1rem] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.16em] disabled:opacity-50"
                    >
                      {actualizandoUsuario === usuarioItem._id ? 'Guardando...' : 'Guardar rol'}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {seccion === 'pedidos' && (
          <div className="space-y-4">
            {cargando ? (
              <p className="text-[#f1decd]">Cargando...</p>
            ) : pedidos.length === 0 ? (
              <div className="panel rounded-[1.8rem] p-8 text-[#6d5040]">No hay pedidos.</div>
            ) : (
              pedidos.map((pedido) => (
                <article key={pedido._id} className="panel rounded-[1.8rem] p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-display text-3xl text-[#2d201a]">
                        Pedido #{pedido._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="mt-2 text-sm text-[#6d5040]">
                        {new Date(pedido.createdAt).toLocaleDateString('es-ES')}
                      </p>
                      {pedido.usuario && (
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#8c684d]">
                          {pedido.usuario.nombre || pedido.usuario.email}
                        </p>
                      )}
                    </div>
                    {/* Badge de estado con color dinámico */}
                    <span
                      className={`rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] ${
                        pedido.estado === 'confirmado'
                          ? 'border-[#4d704a] bg-[#243827] text-[#7ecf7a]'
                          : pedido.estado === 'cancelado'
                          ? 'border-[#7b3f3f] bg-[#4a2224] text-[#ffa0a0]'
                          : 'border-[rgba(121,88,66,0.14)] bg-[rgba(121,88,66,0.08)] text-[#7a5945]'
                      }`}
                    >
                      {pedido.estado}
                    </span>
                  </div>

                  <div className="mt-5 rounded-[1.4rem] border border-[rgba(121,88,66,0.12)] bg-[rgba(255,255,255,0.44)] p-4 text-[#5c4335]">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945]">Productos</p>
                    <div className="mt-3 space-y-2 text-sm">
                      {pedido.items.map((item, idx) => (
                        <p key={idx}>
                          {item.nombre} x{item.cantidad}
                        </p>
                      ))}
                    </div>
                  </div>

                  {pedido.notas && (
                    <div className="mt-4 rounded-[1.3rem] border border-[rgba(121,88,66,0.12)] bg-[rgba(121,88,66,0.06)] p-4 text-sm text-[#6d5040]">
                      <strong>Notas:</strong> {pedido.notas}
                    </div>
                  )}

                  {/* Botones de acción — solo visibles si el pedido aún no está resuelto */}
                  {pedido.estado === 'pendiente' && (
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => cambiarEstadoPedido(pedido._id, 'confirmado')}
                        className="flex-1 rounded-[1rem] border border-[#4d704a] bg-[#243827] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.16em] text-[#7ecf7a] transition hover:bg-[#2e4a30]"
                      >
                        ✓ Confirmar
                      </button>
                      <button
                        onClick={() => cambiarEstadoPedido(pedido._id, 'cancelado')}
                        className="flex-1 rounded-[1rem] border border-[#7b3f3f] bg-[#4a2224] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.16em] text-[#ffa0a0] transition hover:bg-[#5a2a2c]"
                      >
                        ✕ Cancelar
                      </button>
                    </div>
                  )}

                  {/* Si ya tiene estado final, permitir volver a pendiente */}
                  {pedido.estado !== 'pendiente' && (
                    <div className="mt-5">
                      <button
                        onClick={() => cambiarEstadoPedido(pedido._id, 'pendiente')}
                        className="w-full rounded-[1rem] border border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.08)] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.16em] text-[#d8bb98] transition hover:bg-[rgba(255,248,240,0.14)]"
                      >
                        ↺ Restablecer a pendiente
                      </button>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
