import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI } from '../services/api';

export default function MisPedidos() {
  const { usuario, autenticado } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todas');

  useEffect(() => {
    if (!autenticado) {
      navigate('/login');
      return;
    }

    const cargarPedidos = async () => {
      try {
        const data = await pedidosAPI.misPedidos();
        // ✅ La API devuelve { dades: [...], total: N }
        setPedidos(data?.dades || []);
      } catch (err) {
        setError(err.message || 'Error al cargar los pedidos');
      } finally {
        setCargando(false);
      }
    };

    cargarPedidos();
  }, [autenticado, navigate]);

  const pedidosFiltrados = pedidos.filter(
    (pedido) => filtro === 'todas' || pedido.estado === filtro
  );

  const obtenerColorEstado = (estado) => {
    const colores = {
      pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      confirmado: 'bg-green-100 text-green-700 border-green-300',
      cancelado: 'bg-red-100 text-red-700 border-red-300',
    };
    return colores[estado] || colores.pendiente;
  };

  const obtenerIconoEstado = (estado) => {
    const iconos = {
      pendiente: '⏳',
      confirmado: '✓',
      cancelado: '✗',
    };
    return iconos[estado] || '?';
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📋</div>
          <p className="text-xl text-gray-600">Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">📋 Mis Pedidos</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFiltro('todas')}
            className={`px-6 py-2 rounded-full font-semibold transition whitespace-nowrap ${
              filtro === 'todas'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todas ({pedidos.length})
          </button>
          <button
            onClick={() => setFiltro('pendiente')}
            className={`px-6 py-2 rounded-full font-semibold transition whitespace-nowrap ${
              filtro === 'pendiente'
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ⏳ Pendiente ({pedidos.filter((p) => p.estado === 'pendiente').length})
          </button>
          <button
            onClick={() => setFiltro('confirmado')}
            className={`px-6 py-2 rounded-full font-semibold transition whitespace-nowrap ${
              filtro === 'confirmado'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ✓ Confirmado ({pedidos.filter((p) => p.estado === 'confirmado').length})
          </button>
          <button
            onClick={() => setFiltro('cancelado')}
            className={`px-6 py-2 rounded-full font-semibold transition whitespace-nowrap ${
              filtro === 'cancelado'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ✗ Cancelado ({pedidos.filter((p) => p.estado === 'cancelado').length})
          </button>
        </div>

        {/* Lista de Pedidos */}
        {pedidosFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No hay pedidos</h2>
            <p className="text-gray-600 mb-8">
              {filtro === 'todas'
                ? 'Aún no has realizado ningún pedido'
                : `No hay pedidos con estado "${filtro}"`}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
            >
              Ir al Catálogo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidosFiltrados.map((pedido) => (
              <div
                key={pedido._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        Pedido #{pedido._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(pedido.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full font-semibold border ${obtenerColorEstado(pedido.estado)}`}
                    >
                      {obtenerIconoEstado(pedido.estado)}{' '}
                      {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="mb-4 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Productos:</h4>
                    <div className="space-y-2">
                      {pedido.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-700">
                          <span>
                            {item.tipo === 'cerveza' ? '🍺' : '🍷'} {item.nombre} x{item.cantidad}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notas */}
                  {pedido.notas && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Notas:</strong> {pedido.notas}
                      </p>
                    </div>
                  )}

                  {/* Resumen */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <strong>{pedido.items.reduce((sum, item) => sum + item.cantidad, 0)}</strong> producto(s)
                    </div>
                    <div>
                      {pedido.estado === 'pendiente' && (
                        <span className="text-xs text-yellow-600 font-semibold">
                          ⏳ Esperando confirmación...
                        </span>
                      )}
                      {pedido.estado === 'confirmado' && (
                        <span className="text-xs text-green-600 font-semibold">
                          ✓ Tu pedido ha sido confirmado
                        </span>
                      )}
                      {pedido.estado === 'cancelado' && (
                        <span className="text-xs text-red-600 font-semibold">
                          ✗ Tu pedido ha sido cancelado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pedidos.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
            >
              Seguir Comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
}