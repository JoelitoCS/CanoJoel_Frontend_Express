import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cervezasAPI, vinosAPI } from '../services/api';
import { useCarrito } from '../context/CarritoContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function DetalleProducto() {
  const { tipo, id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const { agregarProducto } = useCarrito();
  const navigate = useNavigate();

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        let data;
        if (tipo === 'cerveza') {
          data = await cervezasAPI.obtenerPorId(id);
        } else {
          data = await vinosAPI.obtenerPorId(id);
        }
        setProducto({ ...data, tipo });
      } catch (err) {
        setError('Producto no encontrado');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarProducto();
  }, [tipo, id]);

  const obtenerImagenUrl = (imagen) => {
    if (!imagen) return 'https://via.placeholder.com/400x400?text=Sin+imagen';
    if (imagen.startsWith('http')) return imagen;
    return `${API_URL.replace('/api', '')}/${imagen}`;
  };

  const handleAgregar = () => {
    agregarProducto(producto, cantidad);
    alert('✓ Producto agregado al carrito');
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔍</div>
          <p className="text-xl text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error || 'Producto no encontrado'}
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
          >
            ← Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="text-purple-600 hover:text-purple-800 font-semibold mb-8 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Volver al catálogo</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Imagen */}
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full">
              <img
                src={obtenerImagenUrl(producto.imagen)}
                alt={producto.nombre}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Información */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl">
                  {producto.tipo === 'cerveza' ? '🍺' : '🍷'}
                </span>
                <h1 className="text-4xl font-bold text-gray-800">{producto.nombre}</h1>
              </div>

              <div className="flex items-center space-x-4 mb-8">
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold capitalize">
                  {producto.tipo}
                </span>
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                  {producto.graduacion}° de alcohol
                </span>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Descripción</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {producto.descripcion}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <p className="text-gray-600 text-sm font-semibold mb-2">TIPO</p>
                  <p className="text-2xl font-bold text-gray-800">{producto.tipo}</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <p className="text-gray-600 text-sm font-semibold mb-2">GRADUACIÓN</p>
                  <p className="text-2xl font-bold text-blue-600">{producto.graduacion}%</p>
                </div>
              </div>
            </div>

            {/* Carrito */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 opacity-90">
                  Cantidad
                </label>
                <div className="flex items-center border border-white border-opacity-30 rounded-lg bg-white bg-opacity-10">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="px-4 py-3 text-xl hover:bg-white hover:bg-opacity-20 transition"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 text-2xl font-bold">{cantidad}</span>
                  <button
                    onClick={() => setCantidad(cantidad + 1)}
                    className="px-4 py-3 text-xl hover:bg-white hover:bg-opacity-20 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAgregar}
                className="w-full bg-white text-purple-600 font-bold py-4 rounded-lg hover:bg-gray-100 transition text-lg"
              >
                🛒 Agregar al Carrito
              </button>

              <p className="text-center mt-4 text-sm opacity-90">
                Envío gratuito para pedidos mayores a 5 productos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
