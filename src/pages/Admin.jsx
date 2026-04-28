import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cervezasAPI, vinosAPI, pedidosAPI } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Admin() {
  const { usuario, autenticado, esAdmin } = useAuth();
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState('cervezas'); // 'cervezas', 'vinos', 'pedidos'
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Estados para cervezas
  const [cervezas, setCervezas] = useState([]);
  const [formCerveza, setFormCerveza] = useState({ nombre: '', descripcion: '', graduacion: '', tipo: '' });
  const [editandoCerveza, setEditandoCerveza] = useState(null);

  // Estados para vinos
  const [vinos, setVinos] = useState([]);
  const [formVino, setFormVino] = useState({ nombre: '', descripcion: '', graduacion: '', tipo: '' });
  const [editandoVino, setEditandoVino] = useState(null);

  // Estados para pedidos
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
        setCervezas(data?.dades || []);  // ✅
      } else if (seccion === 'vinos') {
        const data = await vinosAPI.obtener();
        setVinos(data?.dades || []);     // ✅
      } else if (seccion === 'pedidos') {
        const data = await pedidosAPI.obtener();
        setPedidos(data?.dades || []);   // ✅
      }
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setCargando(false);
    }
  };

  // ===== CERVEZAS =====
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
        setExito('✓ Cerveza actualizada');
      } else {
        await cervezasAPI.crear(formCerveza);
        setExito('✓ Cerveza creada');
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
        setExito('✓ Cerveza eliminada');
        cargarDatos();
        setTimeout(() => setExito(''), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // ===== VINOS =====
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
        setExito('✓ Vino actualizado');
      } else {
        await vinosAPI.crear(formVino);
        setExito('✓ Vino creado');
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
        setExito('✓ Vino eliminado');
        cargarDatos();
        setTimeout(() => setExito(''), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">🔧 Panel de Administración</h1>
          <p className="text-gray-400">Bienvenido, {usuario?.nombre || usuario?.email}</p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {exito && (
          <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded-lg mb-6">
            {exito}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-12 border-b border-gray-700">
          <button
            onClick={() => setSeccion('cervezas')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              seccion === 'cervezas'
                ? 'text-purple-400 border-purple-400'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            🍺 Cervezas
          </button>
          <button
            onClick={() => setSeccion('vinos')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              seccion === 'vinos'
                ? 'text-purple-400 border-purple-400'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            🍷 Vinos
          </button>
          <button
            onClick={() => setSeccion('pedidos')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              seccion === 'pedidos'
                ? 'text-purple-400 border-purple-400'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            📋 Pedidos
          </button>
        </div>

        {/* CERVEZAS */}
        {seccion === 'cervezas' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-1">
              <div className="bg-gray-700 rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-bold text-white mb-4">
                  {editandoCerveza ? '✏️ Editar Cerveza' : '➕ Crear Cerveza'}
                </h2>
                <form onSubmit={guardarCerveza} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Nombre</label>
                    <input
                      type="text"
                      value={formCerveza.nombre}
                      onChange={(e) => setFormCerveza({ ...formCerveza, nombre: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-purple-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Descripción</label>
                    <textarea
                      value={formCerveza.descripcion}
                      onChange={(e) => setFormCerveza({ ...formCerveza, descripcion: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-purple-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Graduación</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formCerveza.graduacion}
                      onChange={(e) => setFormCerveza({ ...formCerveza, graduacion: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-purple-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Tipo</label>
                    <input
                      type="text"
                      value={formCerveza.tipo}
                      onChange={(e) => setFormCerveza({ ...formCerveza, tipo: e.target.value })}
                      placeholder="IPA, Lager, Stout..."
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-purple-400 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 rounded hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50"
                  >
                    {cargando ? '⏳' : editandoCerveza ? '✓ Actualizar' : '✓ Crear'}
                  </button>
                  {editandoCerveza && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditandoCerveza(null);
                        setFormCerveza({ nombre: '', descripcion: '', graduacion: '', tipo: '' });
                      }}
                      className="w-full bg-gray-600 text-white font-bold py-2 rounded hover:bg-gray-500 transition"
                    >
                      Cancelar
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Lista */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cargando ? (
                  <p className="text-gray-300">Cargando...</p>
                ) : cervezas.length === 0 ? (
                  <p className="text-gray-300">No hay cervezas</p>
                ) : (
                  cervezas.map((cerveza) => (
                    <div key={cerveza._id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition">
                      <h3 className="font-bold text-white mb-2">{cerveza.nombre}</h3>
                      <p className="text-sm text-gray-300 mb-2 line-clamp-2">{cerveza.descripcion}</p>
                      <div className="flex justify-between text-xs text-gray-400 mb-3">
                        <span>{cerveza.graduacion}°</span>
                        <span>{cerveza.tipo}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditandoCerveza(cerveza);
                            setFormCerveza(cerveza);
                          }}
                          className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition text-sm"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => eliminarCerveza(cerveza._id)}
                          className="flex-1 bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 transition text-sm"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* VINOS */}
        {seccion === 'vinos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-1">
              <div className="bg-gray-700 rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-bold text-white mb-4">
                  {editandoVino ? '✏️ Editar Vino' : '➕ Crear Vino'}
                </h2>
                <form onSubmit={guardarVino} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Nombre</label>
                    <input
                      type="text"
                      value={formVino.nombre}
                      onChange={(e) => setFormVino({ ...formVino, nombre: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-purple-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Descripción</label>
                    <textarea
                      value={formVino.descripcion}
                      onChange={(e) => setFormVino({ ...formVino, descripcion: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-purple-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Graduación</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formVino.graduacion}
                      onChange={(e) => setFormVino({ ...formVino, graduacion: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-purple-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Tipo</label>
                    <input
                      type="text"
                      value={formVino.tipo}
                      onChange={(e) => setFormVino({ ...formVino, tipo: e.target.value })}
                      placeholder="Tinto, Blanco, Rosado..."
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-purple-400 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 rounded hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50"
                  >
                    {cargando ? '⏳' : editandoVino ? '✓ Actualizar' : '✓ Crear'}
                  </button>
                  {editandoVino && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditandoVino(null);
                        setFormVino({ nombre: '', descripcion: '', graduacion: '', tipo: '' });
                      }}
                      className="w-full bg-gray-600 text-white font-bold py-2 rounded hover:bg-gray-500 transition"
                    >
                      Cancelar
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Lista */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cargando ? (
                  <p className="text-gray-300">Cargando...</p>
                ) : vinos.length === 0 ? (
                  <p className="text-gray-300">No hay vinos</p>
                ) : (
                  vinos.map((vino) => (
                    <div key={vino._id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition">
                      <h3 className="font-bold text-white mb-2">{vino.nombre}</h3>
                      <p className="text-sm text-gray-300 mb-2 line-clamp-2">{vino.descripcion}</p>
                      <div className="flex justify-between text-xs text-gray-400 mb-3">
                        <span>{vino.graduacion}°</span>
                        <span>{vino.tipo}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditandoVino(vino);
                            setFormVino(vino);
                          }}
                          className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition text-sm"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => eliminarVino(vino._id)}
                          className="flex-1 bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 transition text-sm"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* PEDIDOS */}
        {seccion === 'pedidos' && (
          <div>
            <div className="grid grid-cols-1 gap-4">
              {cargando ? (
                <p className="text-gray-300">Cargando...</p>
              ) : pedidos.length === 0 ? (
                <p className="text-gray-300">No hay pedidos</p>
              ) : (
                pedidos.map((pedido) => (
                  <div key={pedido._id} className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          Pedido #{pedido._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(pedido.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          pedido.estado === 'pendiente'
                            ? 'bg-yellow-900 text-yellow-200'
                            : pedido.estado === 'confirmado'
                            ? 'bg-green-900 text-green-200'
                            : 'bg-red-900 text-red-200'
                        }`}
                      >
                        {pedido.estado}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-300 text-sm mb-2">
                        <strong>Productos:</strong> {pedido.items.length}
                      </p>
                      <div className="space-y-1 text-sm text-gray-400">
                        {pedido.items.map((item, idx) => (
                          <p key={idx}>
                            {item.tipo === 'cerveza' ? '🍺' : '🍷'} {item.nombre} x{item.cantidad}
                          </p>
                        ))}
                      </div>
                    </div>

                    {pedido.notas && (
                      <div className="mb-4 bg-gray-600 rounded p-3 text-sm text-gray-300">
                        <strong>Notas:</strong> {pedido.notas}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
