import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI } from '../services/api';

export default function MisPedidos() {
  const { autenticado } = useAuth();
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
      pendiente: 'border-[#dcc78f] bg-[#fff7dd] text-[#8a6a2e]',
      confirmado: 'border-[#b5c8b1] bg-[#f2fbef] text-[#4d704a]',
      cancelado: 'border-[#d9b7b7] bg-[#fff2f2] text-[#8d4a4a]',
    };
    return colores[estado] || colores.pendiente;
  };

  if (cargando) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="panel rounded-[2rem] p-12 text-center text-[#6d5040]">Cargando tus pedidos...</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <span className="eyebrow">Pedidos</span>
          <h1 className="mt-4 font-display text-5xl text-[#2d201a]">Historial personal</h1>
        </div>

        {error && <div className="mb-6 rounded-[1.3rem] border border-[#d6a9a9] bg-[#fff2f2] px-4 py-3 text-[#7b3f3f]">{error}</div>}

        <div className="mb-8 flex flex-wrap gap-3">
          {['todas', 'pendiente', 'confirmado', 'cancelado'].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltro(estado)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.16em] transition ${
                filtro === estado
                  ? 'wood-button text-[#fff8ef]'
                  : 'wood-button-soft hover:bg-[rgba(121,88,66,0.1)]'
              }`}
            >
              {estado}
            </button>
          ))}
        </div>

        {pedidosFiltrados.length === 0 ? (
          <div className="panel rounded-[2rem] p-12 text-center">
            <h2 className="font-display text-4xl text-[#2d201a]">No hay pedidos</h2>
            <p className="mt-3 text-[#6d5040]">
              {filtro === 'todas' ? 'Aún no has realizado ningún pedido.' : `No hay pedidos en estado "${filtro}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {pedidosFiltrados.map((pedido) => (
              <article key={pedido._id} className="panel rounded-[1.8rem] p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-display text-3xl text-[#2d201a]">
                      Pedido #{pedido._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="mt-2 text-sm text-[#6d5040]">
                      {new Date(pedido.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className={`rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] ${obtenerColorEstado(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                </div>

                <div className="mt-5 rounded-[1.4rem] border border-[rgba(121,88,66,0.12)] bg-[rgba(255,255,255,0.44)] p-4">
                  <h4 className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#7a5945]">Productos</h4>
                  <div className="mt-3 space-y-2 text-[#5c4335]">
                    {pedido.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between gap-4 text-sm">
                        <span>{item.nombre}</span>
                        <span className="font-semibold">x{item.cantidad}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {pedido.notas && (
                  <div className="mt-4 rounded-[1.3rem] border border-[rgba(121,88,66,0.12)] bg-[rgba(121,88,66,0.06)] p-4 text-sm text-[#6d5040]">
                    <strong>Notas:</strong> {pedido.notas}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
