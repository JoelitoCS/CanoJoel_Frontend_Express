import { useState, useEffect } from 'react';
import { cervezasAPI, vinosAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Home() {
  const [cervezas, setCervezas] = useState([]);
  const [vinos, setVinos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const { agregarProducto } = useCarrito();

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const [dataCervezas, dataVinos] = await Promise.all([
          cervezasAPI.obtener(),
          vinosAPI.obtener(),
        ]);

        // ✅ La API devuelve { dades: [...], total: N }
        setCervezas(dataCervezas?.dades || []);
        setVinos(dataVinos?.dades || []);

      } catch (err) {
        setError('Error al cargar los productos');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  const obtenerImagenUrl = (imagen) => {
    if (!imagen) return 'https://via.placeholder.com/300x300?text=Sin+imagen';
    if (imagen.startsWith('http')) return imagen;
    return `${API_URL.replace('/api', '')}/${imagen}`;
  };

  const ProductoCard = ({ producto, tipo }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105">
      <img
        src={obtenerImagenUrl(producto.imagen)}
        alt={producto.nombre}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 flex-1">{producto.nombre}</h3>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
            {tipo}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{producto.descripcion}</p>

        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs text-gray-500">Graduación</p>
            <p className="text-lg font-bold text-blue-600">{producto.graduacion}°</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Tipo</p>
            <p className="text-sm font-semibold text-gray-700">{producto.tipo}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => agregarProducto({ ...producto, tipo }, 1)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
          >
            🛒 Agregar
          </button>
          <Link
            to={`/producto/${tipo}/${producto._id}`}
            className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300 transition text-center"
          >
            👁️ Ver
          </Link>
        </div>
      </div>
    </div>
  );

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🍺</div>
          <p className="text-xl text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🍺 VinaShop 🍷
          </h1>
          <p className="text-xl text-gray-600">
            Las mejores cervezas y vinos seleccionados para ti
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { key: 'todas', label: '🎯 Todas' },
            { key: 'cervezas', label: '🍺 Cervezas' },
            { key: 'vinos', label: '🍷 Vinos' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                filtro === key
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Cervezas */}
        {(filtro === 'todas' || filtro === 'cervezas') && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">🍺 Cervezas</h2>
            {cervezas.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg">
                <p className="text-gray-600">No hay cervezas disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cervezas.map((cerveza) => (
                  <ProductoCard key={cerveza._id} producto={cerveza} tipo="cerveza" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vinos */}
        {(filtro === 'todas' || filtro === 'vinos') && (
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">🍷 Vinos</h2>
            {vinos.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg">
                <p className="text-gray-600">No hay vinos disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vinos.map((vino) => (
                  <ProductoCard key={vino._id} producto={vino} tipo="vino" />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}