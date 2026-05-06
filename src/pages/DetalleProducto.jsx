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
        const data =
          tipo === 'cerveza'
            ? await cervezasAPI.obtenerPorId(id)
            : await vinosAPI.obtenerPorId(id);
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
    alert('Producto agregado al carrito');
  };

  if (cargando) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="panel rounded-[2rem] p-12 text-center">
          <p className="font-display text-4xl text-[#2d201a]">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="page-shell">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[1.5rem] border border-[#d6a9a9] bg-[#fff2f2] px-6 py-4 text-[#7b3f3f]">
            {error || 'Producto no encontrado'}
          </div>
          <button
            onClick={() => navigate('/')}
            className="wood-button mt-6 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.16em]"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate('/')}
          className="mb-8 text-sm font-bold uppercase tracking-[0.18em] text-[#7a5945] transition hover:text-[#2d201a]"
        >
          Volver al catálogo
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel overflow-hidden rounded-[2.1rem] p-6">
            <img
              src={obtenerImagenUrl(producto.imagen)}
              alt={producto.nombre}
              // En detalle mostramos la imagen completa para cervezas y vinos, evitando zoom o recortes.
              className="h-full max-h-[38rem] w-full rounded-[1.6rem] bg-[rgba(255,248,240,0.72)] object-contain p-6"
            />
          </div>

          <div className="space-y-6">
            <div className="panel rounded-[2.1rem] p-8">
              <span className="eyebrow">{producto.tipo}</span>
              <h1 className="mt-5 font-display text-5xl text-[#2d201a]">{producto.nombre}</h1>
              <p className="mt-4 text-lg leading-8 text-[#5c4335]">{producto.descripcion}</p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-[1.4rem] border border-[rgba(121,88,66,0.14)] bg-[rgba(255,255,255,0.44)] p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#8c684d]">Graduación</p>
                  <p className="mt-2 text-3xl font-extrabold text-[#684634]">{producto.graduacion}%</p>
                </div>
                <div className="rounded-[1.4rem] border border-[rgba(121,88,66,0.14)] bg-[rgba(255,255,255,0.44)] p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#8c684d]">Tipo</p>
                  <p className="mt-2 text-lg font-bold capitalize text-[#3f2e25]">{producto.tipo}</p>
                </div>
              </div>
            </div>

            <div className="panel-dark rounded-[2.1rem] p-8 text-[#fff4e6]">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#d8bb98]">Añadir al carrito</p>
              <div className="mt-5 flex items-center justify-between rounded-[1.3rem] border border-[rgba(231,205,176,0.16)] bg-[rgba(255,248,240,0.05)] px-4 py-3">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="h-10 w-10 rounded-full border border-[rgba(231,205,176,0.18)] text-lg"
                >
                  -
                </button>
                <span className="text-3xl font-bold">{cantidad}</span>
                <button
                  onClick={() => setCantidad(cantidad + 1)}
                  className="h-10 w-10 rounded-full border border-[rgba(231,205,176,0.18)] text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAgregar}
                className="wood-button mt-6 w-full rounded-[1.2rem] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em]"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
