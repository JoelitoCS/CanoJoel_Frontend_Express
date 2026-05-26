import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cervezasAPI, vinosAPI, getImagenUrl } from '../services/api'

const productoInicial = {
  nombre: '', descripcion: '', graduacion: '', tipo: '',
  imagen: '', archivoImagen: null, previewImagen: '',
}

const productoAFormulario = (p) => ({
  nombre: p.nombre || '',
  descripcion: p.descripcion || '',
  graduacion: p.graduacion ?? '',
  tipo: p.tipo || '',
  imagen: p.imagen || '',
  archivoImagen: null,
  previewImagen: '',
})

export default function Editor() {
  const { usuario, autenticado, esEditor } = useAuth()
  const navigate = useNavigate()
  const [seccion, setSeccion] = useState('cervezas')
  const [cargando, setCargando] = useState(false)
  const [error, setError]   = useState('')
  const [exito, setExito]   = useState('')
  const [cervezas, setCervezas] = useState([])
  const [vinos, setVinos]       = useState([])
  const [formCerveza, setFormCerveza]       = useState({ ...productoInicial })
  const [editandoCerveza, setEditandoCerveza] = useState(null)
  const [formVino, setFormVino]           = useState({ ...productoInicial })
  const [editandoVino, setEditandoVino]   = useState(null)

  useEffect(() => {
    if (!autenticado || !esEditor) { navigate('/'); return }
    cargarDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autenticado, esEditor, seccion])

  const cargarDatos = async () => {
    setCargando(true); setError('')
    try {
      if (seccion === 'cervezas') {
        const d = await cervezasAPI.obtener(); setCervezas(d?.dades || [])
      } else {
        const d = await vinosAPI.obtener(); setVinos(d?.dades || [])
      }
    } catch (err) { setError(err.message || 'Error al cargar datos') }
    finally { setCargando(false) }
  }

  const mostrarExito = (msg) => { setExito(msg); setTimeout(() => setExito(''), 3000) }

  // ── CERVEZAS ──
  const guardarCerveza = async (e) => {
    e.preventDefault()
    if (!formCerveza.nombre || !formCerveza.descripcion || !formCerveza.graduacion || !formCerveza.tipo) {
      setError('Completa todos los campos'); return
    }
    setCargando(true); setError('')
    try {
      if (editandoCerveza) {
        await cervezasAPI.actualizar(editandoCerveza._id, formCerveza)
        mostrarExito('Cerveza actualizada ✓')
      } else {
        await cervezasAPI.crear(formCerveza)
        mostrarExito('Cerveza creada ✓')
      }
      setFormCerveza({ ...productoInicial }); setEditandoCerveza(null); cargarDatos()
    } catch (err) { setError(err.message) }
    finally { setCargando(false) }
  }

  const eliminarCerveza = async (id) => {
    if (!window.confirm('¿Eliminar esta cerveza?')) return
    try { await cervezasAPI.eliminar(id); mostrarExito('Cerveza eliminada'); cargarDatos() }
    catch (err) { setError(err.message) }
  }

  // ── VINOS ──
  const guardarVino = async (e) => {
    e.preventDefault()
    if (!formVino.nombre || !formVino.descripcion || !formVino.graduacion || !formVino.tipo) {
      setError('Completa todos los campos'); return
    }
    setCargando(true); setError('')
    try {
      if (editandoVino) {
        await vinosAPI.actualizar(editandoVino._id, formVino)
        mostrarExito('Vino actualizado ✓')
      } else {
        await vinosAPI.crear(formVino)
        mostrarExito('Vino creado ✓')
      }
      setFormVino({ ...productoInicial }); setEditandoVino(null); cargarDatos()
    } catch (err) { setError(err.message) }
    finally { setCargando(false) }
  }

  const eliminarVino = async (id) => {
    if (!window.confirm('¿Eliminar este vino?')) return
    try { await vinosAPI.eliminar(id); mostrarExito('Vino eliminado'); cargarDatos() }
    catch (err) { setError(err.message) }
  }

  // ── FORMULARIO REUTILIZABLE ──
  const renderFormulario = (titulo, form, setForm, onSubmit, editando, onCancel, tipoPlaceholder) => (
    <div className="panel-dark rounded-[2rem] p-6 text-[#fff4e6] lg:sticky lg:top-28">
      <h2 className="font-display text-4xl">{titulo}</h2>
      <form key={editando?._id || titulo} onSubmit={onSubmit} className="mt-6 space-y-4">
        {[['Nombre', 'nombre', 'text'], ['Graduación (°)', 'graduacion', 'number'], ['Tipo', 'tipo', 'text']].map(([label, key, type]) => (
          <div key={key}>
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8bb98]">{label}</label>
            <input
              type={type} step={key === 'graduacion' ? '0.1' : undefined}
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
            value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} rows={4}
            className="w-full rounded-[1.1rem] border border-[rgba(231,205,176,0.18)] bg-[rgba(255,248,240,0.07)] px-4 py-3 text-[#fff4e6] outline-none transition focus:border-[#d8bb98]"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8bb98]">Imagen del producto</label>
          {(form.previewImagen || form.imagen) && (
            <div className="mb-3 overflow-hidden rounded-[1.1rem] border border-[rgba(231,205,176,0.14)]">
              <img src={form.previewImagen || getImagenUrl(form.imagen)} alt="Preview" className="h-44 w-full object-cover" />
            </div>
          )}
          <input
            type="file" accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={e => {
              const archivo = e.target.files?.[0] || null
              setForm({ ...form, archivoImagen: archivo, previewImagen: archivo ? URL.createObjectURL(archivo) : '' })
            }}
            className="w-full rounded-[1.1rem] border border-[rgba(231,205,176,0.18)] bg-[rgba(255,248,240,0.07)] px-4 py-3 text-sm text-[#d8bb98] outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#d8bb98] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#2d201a]"
          />
          {form.archivoImagen && (
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#d8bb98]">📷 {form.archivoImagen.name}</p>
          )}
        </div>
        <button type="submit" disabled={cargando}
          className="wood-button w-full rounded-[1.1rem] px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] disabled:opacity-50">
          {cargando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear'}
        </button>
        {editando && (
          <button type="button" onClick={onCancel}
            className="w-full rounded-[1.1rem] border border-[rgba(231,205,176,0.18)] bg-[rgba(255,248,240,0.06)] px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#d8bb98]">
            Cancelar
          </button>
        )}
      </form>
    </div>
  )

  // ── LISTA REUTILIZABLE ──
  const renderLista = (items, onEdit, onDelete) => (
    <div className="grid gap-4 md:grid-cols-2">
      {cargando ? <p className="text-[#d8bb98] italic">Cargando...</p>
      : items.length === 0 ? <div className="panel col-span-2 rounded-[1.8rem] p-8 text-[#6d5040]">No hay elementos todavía.</div>
      : items.map(item => (
        <article key={item._id} className="panel rounded-[1.8rem] p-5">
          <div className="flex gap-4">
            {item.imagen ? (
              <img src={getImagenUrl(item.imagen)} alt={item.nombre} className="h-24 w-24 shrink-0 rounded-[1.1rem] object-cover" />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.1rem] border border-[rgba(121,88,66,0.14)] bg-[rgba(121,88,66,0.07)] text-[0.6rem] font-bold uppercase tracking-widest text-[#8c684d]">Sin foto</div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-2xl text-[#2d201a]">{item.nombre}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-[#5c4335]">{item.descripcion}</p>
              <div className="mt-2 flex gap-3 text-xs text-[#7a5945]">
                <span>{item.graduacion}°</span><span>·</span><span>{item.tipo}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => { onEdit(item); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="wood-button-soft flex-1 rounded-[1rem] px-3 py-2.5 text-sm font-bold uppercase tracking-widest">Editar</button>
            <button onClick={() => onDelete(item._id)}
              className="flex-1 rounded-[1rem] border border-[#d9b7b7] bg-[#fff6f6] px-3 py-2.5 text-sm font-bold uppercase tracking-widest text-[#8d4a4a] transition hover:bg-[#ffe8e8]">Eliminar</button>
          </div>
        </article>
      ))}
    </div>
  )

  return (
    <div className="page-shell bg-[linear-gradient(170deg,rgba(34,24,20,0.97),rgba(20,14,11,0.99))]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <span className="eyebrow border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.08)] text-[#d8bb98]">Editor</span>
          <h1 className="mt-4 font-display text-5xl text-[#fff4e6]">Editorial de productos</h1>
          <p className="mt-2 text-[#d6b895]">Bienvenido, {usuario?.nombre || usuario?.email}</p>
        </div>

        {error && <div className="mb-6 rounded-[1.3rem] border border-[#7b3f3f] bg-[#4a2224] px-5 py-3 text-[#ffdada]">{error}</div>}
        {exito && <div className="mb-6 rounded-[1.3rem] border border-[#4d704a] bg-[#243827] px-5 py-3 text-[#daf4d8]">{exito}</div>}

        <div className="mb-8 flex gap-3">
          {['cervezas', 'vinos'].map(key => (
            <button key={key} onClick={() => setSeccion(key)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.16em] transition ${
                seccion === key ? 'wood-button' : 'border border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.05)] text-[#f1decd] hover:bg-[rgba(255,248,240,0.1)]'
              }`}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {seccion === 'cervezas' && (
          <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
            {renderFormulario(
              editandoCerveza ? 'Editar cerveza' : 'Nueva cerveza',
              formCerveza, setFormCerveza, guardarCerveza, editandoCerveza,
              () => { setEditandoCerveza(null); setFormCerveza({ ...productoInicial }) },
              'IPA, Lager, Stout...'
            )}
            {renderLista(cervezas, c => { setEditandoCerveza(c); setFormCerveza(productoAFormulario(c)) }, eliminarCerveza)}
          </div>
        )}

        {seccion === 'vinos' && (
          <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
            {renderFormulario(
              editandoVino ? 'Editar vino' : 'Nuevo vino',
              formVino, setFormVino, guardarVino, editandoVino,
              () => { setEditandoVino(null); setFormVino({ ...productoInicial }) },
              'Tinto, Blanco, Rosado...'
            )}
            {renderLista(vinos, v => { setEditandoVino(v); setFormVino(productoAFormulario(v)) }, eliminarVino)}
          </div>
        )}
      </div>
    </div>
  )
}
