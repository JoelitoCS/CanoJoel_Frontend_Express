import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cervezasAPI, vinosAPI, pedidosAPI } from '../services/api';

export default function Admin() {
  const { usuario, autenticado, esAdmin } = useAuth();
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState('cervezas');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cervezas, setCervezas] = useState([]);
  const [formCerveza, setFormCerveza] = useState({ nombre: '', descripcion: '', graduacion: '', tipo: '' });
  const [editandoCerveza, setEditandoCerveza] = useState(null);
  const [vinos, setVinos] = useState([]);
  const [formVino, setFormVino] = useState({ nombre: '', descripcion: '', graduacion: '', tipo: '' });
  const [editandoVino, setEditandoVino] = useState(null);
  const [pedidos, setPedidos] = useState([]);

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
      }
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setCargando(false);
    }
  };

  const guardarCerveza = async (e) => {
    e.preventDefault();
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
      setFormCerveza({ nombre: '', descripcion: '', graduacion: '', tipo: '' });
      setEditandoCerveza(null);
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
      setFormVino({ nombre: '', descripcion: '', graduacion: '', tipo: '' });
      setEditandoVino(null);
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

  const renderFormulario = (titulo, form, setForm, onSubmit, editando, onCancel, placeholderTipo) => (
    <div className="panel-dark rounded-[2rem] p-6 text-[#fff4e6] lg:sticky lg:top-28">
      <h2 className="font-display text-4xl">{titulo}</h2>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
            <h3 className="font-display text-3xl text-[#2d201a]">{item.nombre}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-[#5c4335]">{item.descripcion}</p>
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
          {['cervezas', 'vinos', 'pedidos'].map((key) => (
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
                setFormCerveza({ nombre: '', descripcion: '', graduacion: '', tipo: '' });
              },
              'IPA, Lager, Stout...'
            )}
            {renderLista(
              cervezas,
              (cerveza) => {
                setEditandoCerveza(cerveza);
                setFormCerveza(cerveza);
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
                setFormVino({ nombre: '', descripcion: '', graduacion: '', tipo: '' });
              },
              'Tinto, Blanco, Rosado...'
            )}
            {renderLista(
              vinos,
              (vino) => {
                setEditandoVino(vino);
                setFormVino(vino);
              },
              eliminarVino
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
                    </div>
                    <span className="rounded-full border border-[rgba(121,88,66,0.14)] bg-[rgba(121,88,66,0.08)] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#7a5945]">
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
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
