import { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI } from '../services/api';

export default function Carrito() {
  const { items, actualizarCantidad, eliminarProducto, vaciarCarrito } = useCarrito();
  const { autenticado } = useAuth();
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
      setExito('Pedido realizado exitosamente');
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
      <div className="page-shell">
        <div className="mx-auto max-w-5xl">
          <div className="panel rounded-[2rem] p-12 text-center">
            <h1 className="font-display text-5xl text-[#2d201a]">Tu carrito está vacío</h1>
            <p className="mt-4 text-[#6d5040]">Explora el catálogo y añade productos a tu selección.</p>
            <button
              onClick={() => navigate('/')}
              className="wood-button mt-8 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.16em]"
            >
              Ver catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <span className="eyebrow">Carrito</span>
          <h1 className="mt-4 font-display text-5xl text-[#2d201a]">Resumen de compra</h1>
        </div>

        {error && <div className="mb-6 rounded-[1.3rem] border border-[#d6a9a9] bg-[#fff2f2] px-4 py-3 text-[#7b3f3f]">{error}</div>}
        {exito && <div className="mb-6 rounded-[1.3rem] border border-[#abc8a8] bg-[#f3fbf1] px-4 py-3 text-[#446243]">{exito}</div>}

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="panel overflow-hidden rounded-[2rem]">
              {items.map((item) => (
                <div
                  key={`${item.productoId}-${item.tipo}`}
                  className="flex flex-col gap-4 border-b border-[rgba(121,88,66,0.12)] px-6 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-display text-3xl text-[#2d201a]">{item.nombre}</h3>
                    <p className="text-sm capitalize text-[#6d5040]">{item.tipo}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-[rgba(121,88,66,0.16)] bg-[rgba(255,255,255,0.5)] px-2 py-1">
                      <button
                        onClick={() => actualizarCantidad(item.productoId, item.tipo, item.cantidad - 1)}
                        className="h-10 w-10 rounded-full text-lg text-[#7a5945] transition hover:bg-[rgba(121,88,66,0.1)]"
                      >
                        -
                      </button>
                      <span className="px-4 font-bold text-[#2d201a]">{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(item.productoId, item.tipo, item.cantidad + 1)}
                        className="h-10 w-10 rounded-full text-lg text-[#7a5945] transition hover:bg-[rgba(121,88,66,0.1)]"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => eliminarProducto(item.productoId, item.tipo)}
                      className="rounded-full border border-[#d9b7b7] px-4 py-2 text-sm font-bold text-[#8d4a4a] transition hover:bg-[#fff2f2]"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="panel rounded-[2rem] p-6">
              <h2 className="font-display text-3xl text-[#2d201a]">Notas adicionales</h2>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Agrega instrucciones especiales o comentarios sobre tu pedido..."
                className="mt-4 min-h-32 w-full rounded-[1.2rem] border border-[rgba(121,88,66,0.18)] bg-[rgba(255,252,247,0.9)] px-4 py-3.5 outline-none transition focus:border-[#a77953] focus:bg-white"
              />
            </div>
          </div>

          <aside className="panel rounded-[2rem] p-6 lg:sticky lg:top-28 lg:h-fit">
            <h2 className="font-display text-3xl text-[#2d201a]">Resumen</h2>
            <div className="mt-6 space-y-4 text-[#5c4335]">
              <div className="flex justify-between">
                <span>Total de artículos</span>
                <span className="font-bold text-[#2d201a]">{items.reduce((sum, item) => sum + item.cantidad, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Productos distintos</span>
                <span className="font-bold text-[#2d201a]">{items.length}</span>
              </div>
            </div>

            <div className="my-6 rounded-[1.4rem] border border-[rgba(121,88,66,0.12)] bg-[rgba(255,255,255,0.44)] p-4">
              <p className="text-sm text-[#6d5040]">El pago se gestiona en checkout.</p>
            </div>

            {autenticado ? (
              <div className="space-y-3">
                <button
                  onClick={handleConfirmarPedido}
                  disabled={cargando || items.length === 0}
                  className="wood-button w-full rounded-[1.2rem] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cargando ? 'Procesando...' : 'Confirmar pedido'}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="wood-button-soft w-full rounded-[1.2rem] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em]"
                >
                  Seguir comprando
                </button>
                <button
                  onClick={vaciarCarrito}
                  className="w-full rounded-[1.2rem] border border-[#d9b7b7] bg-[#fff6f6] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#8d4a4a]"
                >
                  Vaciar carrito
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-[#6d5040]">Debes iniciar sesión para confirmar tu pedido.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="wood-button w-full rounded-[1.2rem] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em]"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate('/registro')}
                  className="wood-button-soft w-full rounded-[1.2rem] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.16em]"
                >
                  Registrarse
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
