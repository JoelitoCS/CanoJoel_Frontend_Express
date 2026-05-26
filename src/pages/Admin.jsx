import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cervezasAPI, vinosAPI, pedidosAPI, usuariosAPI, getImagenUrl } from '../services/api';

const productoInicial = {
  nombre: '', descripcion: '', graduacion: '', tipo: '',
  imagen: '', archivoImagen: null, previewImagen: '',
};

const productoAFormulario = (p) => ({
  nombre: p.nombre || '',
  descripcion: p.descripcion || '',
  graduacion: p.graduacion ?? '',
  tipo: p.tipo || '',
  imagen: p.imagen || '',
  archivoImagen: null,
  previewImagen: '',
});

// Los roles que acepta el backend (exactamente estos valores)
const ROLES = ['usuari', 'editor', 'admin'];

export default function Admin() {
  const { usuario, autenticado, esAdmin } = useAuth();
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState('cervezas');
  const [cargando, setCargando] = useState(false);
  const [error, setError]   = useState('');
  const [exito, setExito]   = useState('');

  // — Cervezas —
  const [cervezas, setCervezas]             = useState([]);
  const [formCerveza, setFormCerveza]       = useState({ ...productoInicial });
  const [editandoCerveza, setEditandoCerveza] = useState(null);
  const formCervezaRef = useRef(null);

  // — Vinos —
  const [vinos, setVinos]               = useState([]);
  const [formVino, setFormVino]         = useState({ ...productoInicial });
  const [editandoVino, setEditandoVino] = useState(null);
  const formVinoRef = useRef(null);

  // — Pedidos —
  const [pedidos, setPedidos] = useState([]);

  // — Usuarios: guardamos una copia local con el rol pendiente de guardar —
  const [usuarios, setUsuarios]               = useState([]);
  const [rolesLocales, setRolesLocales]       = useState({});   // { [id]: rolSeleccionado }
  const [guardandoRol, setGuardandoRol]       = useState(null); // id del usuario guardándose

  // — Redirect si no es admin —
  useEffect(() => {
    if (!autenticado || !esAdmin) navigate('/');
  }, [autenticado, esAdmin, navigate]);

  // — Cargar datos al cambiar sección —
  useEffect(() => {
    if (!autenticado || !esAdmin) return;
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seccion]);

  const cargarDatos = async () => {
    setCargando(true);
    setError('');
    try {
      if (seccion === 'cervezas') {
        const d = await cervezasAPI.obtener();
        setCervezas(d?.dades || []);
      } else if (seccion === 'vinos') {
        const d = await vinosAPI.obtener();
        setVinos(d?.dades || []);
      } else if (seccion === 'pedidos') {
        const d = await pedidosAPI.obtener();
        setPedidos(d?.dades || []);
      } else if (seccion === 'usuarios') {
        const d = await usuariosAPI.obtener();
        const lista = d?.dades || [];
        setUsuarios(lista);
        // Inicializar roles locales con el valor actual de cada usuario
        const mapa = {};
        lista.forEach(u => { mapa[u._id] = u.rol; });
        setRolesLocales(mapa);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setCargando(false);
    }
  };

  const mostrarExito = (msg) => {
    setExito(msg);
    setTimeout(() => setExito(''), 3000);
  };

  // ── CERVEZAS ──────────────────────────────────────────────
  const guardarCerveza = async (e) => {
    e.preventDefault();
    if (!formCerveza.nombre || !formCerveza.descripcion || !formCerveza.graduacion || !formCerveza.tipo) {
      setError('Completa todos los campos'); return;
    }
    setCargando(true); setError('');
    try {
      if (editandoCerveza) {
        await cervezasAPI.actualizar(editandoCerveza._id, formCerveza);
        mostrarExito('Cerveza actualizada ✓');
      } else {
        await cervezasAPI.crear(formCerveza);
        mostrarExito('Cerveza creada ✓');
      }
      setFormCerveza({ ...productoInicial });
      setEditandoCerveza(null);
      cargarDatos();
    } catch (err) { setError(err.message); }
    finally { setCargando(false); }
  };

  const eliminarCerveza = async (id) => {
    if (!window.confirm('¿Eliminar esta cerveza?')) return;
    try { await cervezasAPI.eliminar(id); mostrarExito('Cerveza eliminada'); cargarDatos(); }
    catch (err) { setError(err.message); }
  };

  // ── VINOS ─────────────────────────────────────────────────
  const guardarVino = async (e) => {
    e.preventDefault();
    if (!formVino.nombre || !formVino.descripcion || !formVino.graduacion || !formVino.tipo) {
      setError('Completa todos los campos'); return;
    }
    setCargando(true); setError('');
    try {
      if (editandoVino) {
        await vinosAPI.actualizar(editandoVino._id, formVino);
        mostrarExito('Vino actualizado ✓');
      } else {
        await vinosAPI.crear(formVino);
        mostrarExito('Vino creado ✓');
      }
      setFormVino({ ...productoInicial });
      setEditandoVino(null);
      cargarDatos();
    } catch (err) { setError(err.message); }
    finally { setCargando(false); }
  };

  const eliminarVino = async (id) => {
    if (!window.confirm('¿Eliminar este vino?')) return;
    try { await vinosAPI.eliminar(id); mostrarExito('Vino eliminado'); cargarDatos(); }
    catch (err) { setError(err.message); }
  };

  // ── USUARIOS / ROLES ──────────────────────────────────────
  const guardarRol = async (usuarioItem) => {
    if (usuarioItem._id === usuario._id) {
      setError('No puedes cambiar tu propio rol.'); return;
    }
    const rolNuevo = rolesLocales[usuarioItem._id];
    if (!rolNuevo) return;

    setGuardandoRol(usuarioItem._id);
    setError('');
    try {
      // PATCH /api/usuaris/:id/rol  con body { rol: 'usuari' | 'editor' | 'admin' }
      await usuariosAPI.actualizarRol(usuarioItem._id, rolNuevo);
      // Actualizar lista local para reflejar el cambio visualmente sin recargar
      setUsuarios(prev => prev.map(u => u._id === usuarioItem._id ? { ...u, rol: rolNuevo } : u));
      mostrarExito(`Rol de ${usuarioItem.nombre || usuarioItem.email} actualizado a "${rolNuevo}" ✓`);
    } catch (err) {
      setError(err.message || 'Error al actualizar rol');
    } finally {
      setGuardandoRol(null);
    }
  };

  // ── FORMULARIO DE PRODUCTO (reutilizable) ─────────────────
  const renderFormulario = (titulo, form, setForm, onSubmit, editando, onCancel, tipoPlaceholder, formRef) => (
    <div className="panel-dark rounded-[2rem] p-6 text-[#fff4e6] lg:sticky lg:top-28">
      <h2 className="font-display text-4xl">{titulo}</h2>
      <form ref={formRef} key={editando?._id || titulo} onSubmit={onSubmit} className="mt-6 space-y-4">

        {[['Nombre', 'nombre', 'text'], ['Graduación (°)', 'graduacion', 'number'], ['Tipo', 'tipo', 'text']].map(([label, key, type]) => (
          <div key={key}>
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8bb98]">{label}</label>
            <input
              type={type}
              step={key === 'graduacion' ? '0.1' : undefined}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              placeholder={key === 'tipo' ? tipoPlaceholder : ''}
              className="w-full rounded-[1.1rem] border border-[rgba(231,205,176,0.18)] bg-[rgba(255,248,240,0.07)] px-4 py-3 text-[#fff4e6] outline-none transition focus:border-[#d8bb98] placeholder:text-[rgba(216,187,152,0.4)]"
            />
          </div>
        ))}

        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8bb98]">Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={e => setForm({ ...form, descripcion: e.target.value })}
            rows={4}
            className="w-full rounded-[1.1rem] border border-[rgba(231,205,176,0.18)] bg-[rgba(255,248,240,0.07)] px-4 py-3 text-[#fff4e6] outline-none transition focus:border-[#d8bb98]"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8bb98]">Imagen del producto</label>

          {/* Preview: muestra la nueva imagen elegida o la ya guardada */}
          {(form.previewImagen || form.imagen) && (
            <div className="mb-3 overflow-hidden rounded-[1.1rem] border border-[rgba(231,205,176,0.14)]">
              <img
                src={form.previewImagen || getImagenUrl(form.imagen)}
                alt="Preview"
                className="h-44 w-full object-cover"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={e => {
              const archivo = e.target.files?.[0] || null;
              const previewImagen = archivo ? URL.createObjectURL(archivo) : '';
              setForm({ ...form, archivoImagen: archivo, previewImagen });
            }}
            className="w-full rounded-[1.1rem] border border-[rgba(231,205,176,0.18)] bg-[rgba(255,248,240,0.07)] px-4 py-3 text-sm text-[#d8bb98] outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#d8bb98] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#2d201a] focus:border-[#d8bb98]"
          />
          {form.archivoImagen && (
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#d8bb98]">
              📷 {form.archivoImagen.name}
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
            className="w-full rounded-[1.1rem] border border-[rgba(231,205,176,0.18)] bg-[rgba(255,248,240,0.06)] px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#d8bb98]"
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );

  // ── LISTA DE PRODUCTOS ────────────────────────────────────
  const renderLista = (items, onEdit, onDelete) => (
    <div className="grid gap-4 md:grid-cols-2">
      {cargando ? (
        <p className="text-[#d8bb98] italic">Cargando...</p>
      ) : items.length === 0 ? (
        <div className="panel rounded-[1.8rem] p-8 text-[#6d5040] col-span-2">No hay elementos todavía.</div>
      ) : items.map(item => (
        <article key={item._id} className="panel rounded-[1.8rem] p-5">
          <div className="flex gap-4">
            {item.imagen ? (
              <img
                src={getImagenUrl(item.imagen)}
                alt={item.nombre}
                className="h-24 w-24 shrink-0 rounded-[1.1rem] object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.1rem] border border-[rgba(121,88,66,0.14)] bg-[rgba(121,88,66,0.07)] text-[0.6rem] font-bold uppercase tracking-widest text-[#8c684d]">
                Sin foto
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-2xl text-[#2d201a]">{item.nombre}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-[#5c4335]">{item.descripcion}</p>
              <div className="mt-2 flex gap-3 text-xs text-[#7a5945]">
                <span>{item.graduacion}°</span>
                <span>·</span>
                <span>{item.tipo}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => onEdit(item)}
              className="wood-button-soft flex-1 rounded-[1rem] px-3 py-2.5 text-sm font-bold uppercase tracking-widest"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(item._id)}
              className="flex-1 rounded-[1rem] border border-[#d9b7b7] bg-[#fff6f6] px-3 py-2.5 text-sm font-bold uppercase tracking-widest text-[#8d4a4a] transition hover:bg-[#ffe8e8]"
            >
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <div className="page-shell bg-[linear-gradient(170deg,rgba(34,24,20,0.97),rgba(20,14,11,0.99))]">
      <div className="mx-auto max-w-7xl">

        {/* Cabecera */}
        <div className="mb-8">
          <span className="eyebrow border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.08)] text-[#d8bb98]">Panel de control</span>
          <h1 className="mt-4 font-display text-5xl text-[#fff4e6]">Administración</h1>
          <p className="mt-2 text-[#d6b895]">Bienvenido, {usuario?.nombre || usuario?.email}</p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="mb-6 rounded-[1.3rem] border border-[#7b3f3f] bg-[#4a2224] px-5 py-3 text-[#ffdada]">{error}</div>
        )}
        {exito && (
          <div className="mb-6 rounded-[1.3rem] border border-[#4d704a] bg-[#243827] px-5 py-3 text-[#daf4d8]">{exito}</div>
        )}

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {['cervezas', 'vinos', 'pedidos', 'usuarios'].map(key => (
            <button
              key={key}
              onClick={() => setSeccion(key)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.16em] transition ${
                seccion === key
                  ? 'wood-button'
                  : 'border border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.05)] text-[#f1decd] hover:bg-[rgba(255,248,240,0.1)]'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Sección Cervezas ── */}
        {seccion === 'cervezas' && (
          <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
            {renderFormulario(
              editandoCerveza ? 'Editar cerveza' : 'Nueva cerveza',
              formCerveza, setFormCerveza, guardarCerveza, editandoCerveza,
              () => { setEditandoCerveza(null); setFormCerveza({ ...productoInicial }); },
              'IPA, Lager, Stout...', formCervezaRef
            )}
            {renderLista(
              cervezas,
              (c) => { setEditandoCerveza(c); setFormCerveza(productoAFormulario(c)); window.scrollTo({ top: 0, behavior: 'smooth' }); },
              eliminarCerveza
            )}
          </div>
        )}

        {/* ── Sección Vinos ── */}
        {seccion === 'vinos' && (
          <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
            {renderFormulario(
              editandoVino ? 'Editar vino' : 'Nuevo vino',
              formVino, setFormVino, guardarVino, editandoVino,
              () => { setEditandoVino(null); setFormVino({ ...productoInicial }); },
              'Tinto, Blanco, Rosado...', formVinoRef
            )}
            {renderLista(
              vinos,
              (v) => { setEditandoVino(v); setFormVino(productoAFormulario(v)); window.scrollTo({ top: 0, behavior: 'smooth' }); },
              eliminarVino
            )}
          </div>
        )}

        {/* ── Sección Pedidos ── */}
        {seccion === 'pedidos' && (
          <div className="space-y-4">
            {cargando ? (
              <p className="text-[#d8bb98] italic">Cargando pedidos...</p>
            ) : pedidos.length === 0 ? (
              <div className="panel rounded-[1.8rem] p-8 text-[#6d5040]">No hay pedidos.</div>
            ) : pedidos.map(pedido => (
              <article key={pedido._id} className="panel rounded-[1.8rem] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-[#2d201a]">
                      Pedido <span className="text-[#7a5945]">#{pedido._id.slice(-8).toUpperCase()}</span>
                    </h3>
                    <p className="mt-1 text-sm text-[#6d5040]">{new Date(pedido.createdAt).toLocaleString('es-ES')}</p>
                    {pedido.usuario && (
                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#8c684d]">
                        {pedido.usuario.nombre || pedido.usuario.email}
                      </p>
                    )}
                  </div>
                  <span className={`rounded-full border px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest ${
                    pedido.estado === 'confirmado' ? 'border-[#4d704a] bg-[#243827] text-[#7ecf7a]'
                    : pedido.estado === 'cancelado' ? 'border-[#7b3f3f] bg-[#4a2224] text-[#ffa0a0]'
                    : 'border-[rgba(121,88,66,0.14)] bg-[rgba(121,88,66,0.08)] text-[#7a5945]'
                  }`}>{pedido.estado}</span>
                </div>
                <div className="mt-4 rounded-[1.4rem] border border-[rgba(121,88,66,0.12)] bg-white/40 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#7a5945]">Productos</p>
                  {pedido.items.map((item, i) => (
                    <p key={i} className="text-sm text-[#5c4335]">• {item.nombre} × {item.cantidad} <span className="text-xs text-[#8c684d]">({item.tipo})</span></p>
                  ))}
                </div>
                {pedido.notas && (
                  <p className="mt-3 rounded-[1.2rem] border border-[rgba(121,88,66,0.1)] bg-[rgba(121,88,66,0.05)] p-3 text-sm text-[#6d5040]">
                    <strong>Notas:</strong> {pedido.notas}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        {/* ── Sección Usuarios ── */}
        {seccion === 'usuarios' && (
          <div className="space-y-4">
            {cargando ? (
              <p className="text-[#d8bb98] italic">Cargando usuarios...</p>
            ) : usuarios.length === 0 ? (
              <div className="panel rounded-[1.8rem] p-8 text-[#6d5040]">No hay usuarios registrados.</div>
            ) : usuarios.map(u => (
              <article key={u._id} className="panel rounded-[1.8rem] p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {u.foto ? (
                      <img src={getImagenUrl(u.foto)} alt={u.nombre} className="h-12 w-12 rounded-full object-cover border-2 border-[rgba(121,88,66,0.2)]" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(121,88,66,0.12)] font-display text-xl text-[#7a5945]">
                        {(u.nombre || u.email || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-display text-2xl text-[#2d201a]">{u.nombre || '—'}</p>
                      <p className="text-sm text-[#6d5040]">{u.email}</p>
                    </div>
                  </div>
                  {/* Badge con el rol ACTUAL guardado en BD */}
                  <span className={`rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-widest ${
                    u.rol === 'admin'  ? 'border-[#7b3f3f] bg-[#fff2f2] text-[#8d4a4a]'
                    : u.rol === 'editor' ? 'border-[#4d704a] bg-[#f0fdf0] text-[#446243]'
                    : 'border-[rgba(121,88,66,0.14)] bg-[rgba(121,88,66,0.07)] text-[#7a5945]'
                  }`}>{u.rol}</span>
                </div>

                {/* Control de cambio de rol */}
                {u._id !== usuario._id ? (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <select
                      value={rolesLocales[u._id] || u.rol}
                      onChange={e => setRolesLocales(prev => ({ ...prev, [u._id]: e.target.value }))}
                      className="flex-1 min-w-[160px] rounded-[1.1rem] border border-[#b78c66] bg-[#fff4e0] px-4 py-3 text-[#2d201a] outline-none transition focus:border-[#a77953] focus:ring-2 focus:ring-[#d8bb98]/30"
                    >
                      {ROLES.map(r => (
                        <option key={r} value={r}>
                          {r === 'usuari' ? 'Usuario' : r.charAt(0).toUpperCase() + r.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => guardarRol(u)}
                      disabled={guardandoRol === u._id || rolesLocales[u._id] === u.rol}
                      className="wood-button-soft rounded-[1.1rem] px-5 py-3 text-sm font-bold uppercase tracking-widest disabled:opacity-40"
                    >
                      {guardandoRol === u._id ? 'Guardando...' : 'Guardar rol'}
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-[#8c684d] italic">Este es tu propio usuario — no puedes cambiar tu rol.</p>
                )}
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
