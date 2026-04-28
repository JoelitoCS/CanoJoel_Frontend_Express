import { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI } from '../services/api';

export default function Carrito() {
  const { items, actualizarCantidad, eliminarProducto, vaciarCarrito } = useCarrito();
  const { usuario, autenticado } = useAuth();
  const navigate = useNavigate();
  const [notas, setNotas] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleConfirmarPedido = async () => {
    if (!autenticado) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    setCargando(true);
    setError('');
    setExito('');

    try {
      await pedidosAPI.crear(items, notas);
      setExito('¡Pedido realizado exitosamente!');
      vaciarCarrito();
      setNotas('');
      setTimeout(() => {
        navigate('/mis-pedidos');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al crear el pedido');
    } finally {
      setCargando(false);
    }
  };

  if (items.length === 0 && !exito) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">🛒 Carrito de Compras</h1>

          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">
              ¡Explora nuestro catálogo y agrega algunos productos!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
            >
              Ver Catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">🛒 Carrito de Compras</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {exito && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {exito}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {items.map((item) => (
                <div
                  key={`${item.productoId}-${item.tipo}`}
                  className="border-b p-6 hover:bg-gray-50 transition flex justify-between items-center"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{item.nombre}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {item.tipo === 'cerveza' ? '🍺 Cerveza' : '🍷 Vino'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => actualizarCantidad(item.productoId, item.tipo, item.cantidad - 1)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 font-semibold text-gray-800">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => actualizarCantidad(item.productoId, item.tipo, item.cantidad + 1)}
                        className="px-3 py-2 text-green-600 hover:bg-green-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => eliminarProducto(item.productoId, item.tipo)}
                      className="text-red-600 hover:text-red-800 font-bold text-xl"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Notas */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">📝 Notas adicionales</h3>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Agrega instrucciones especiales o comentarios sobre tu pedido..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
                rows="4"
              />
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📦 Resumen</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Total de artículos:</span>
                  <span className="font-semibold">
                    {items.reduce((sum, item) => sum + item.cantidad, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Diferentes productos:</span>
                  <span className="font-semibold">{items.length}</span>
                </div>
              </div>

              <div className="border-t border-b py-4 mb-6">
                <div className="flex justify-between text-gray-800 font-bold text-lg">
                  <span>Subtotal:</span>
                  <span>$ -{items.length} prod.</span>
                </div>
                <p className="text-xs text-gray-600 mt-2 italic">
                  * El pago se gestiona en checkout
                </p>
              </div>

              {autenticado ? (
                <div className="space-y-3">
                  <button
                    onClick={handleConfirmarPedido}
                    disabled={cargando || items.length === 0}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cargando ? '⏳ Procesando...' : '✓ Confirmar Pedido'}
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    Seguir Comprando
                  </button>
                  <button
                    onClick={vaciarCarrito}
                    className="w-full bg-red-100 text-red-600 font-bold py-3 rounded-lg hover:bg-red-200 transition"
                  >
                    Vaciar Carrito
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-center text-gray-600 mb-4">
                    Debes iniciar sesión para confirmar tu pedido
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate('/registro')}
                    className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
