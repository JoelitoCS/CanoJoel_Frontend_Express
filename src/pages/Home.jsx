import { useState, useEffect } from 'react';
import { cervezasAPI, vinosAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const API_URL = import.meta.env.VITE_API_URL;

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
    <article className="panel group overflow-hidden rounded-[1.9rem] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_60px_rgba(54,35,24,0.16)]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(28,18,14,0.34)_100%)]" />
        <img
          src={obtenerImagenUrl(producto.imagen)}
          alt={producto.nombre}
          className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-5 top-5 rounded-full border border-[rgba(255,244,230,0.45)] bg-[rgba(32,22,18,0.54)] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.25em] text-[#f8e7d1]">
          {tipo}
        </span>
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-3xl leading-none text-[#2d201a]">{producto.nombre}</h3>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-[#8c684d]">
              Selección artesanal
            </p>
          </div>
          <div className="rounded-2xl border border-[rgba(121,88,66,0.12)] bg-[rgba(121,88,66,0.06)] px-3 py-2 text-right">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#8c684d]">Alcohol</p>
            <p className="text-lg font-extrabold text-[#684634]">{producto.graduacion}°</p>
          </div>
        </div>

        <p className="line-clamp-2 text-[0.95rem] text-[#5c4335]">{producto.descripcion}</p>

        <div className="my-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[rgba(121,88,66,0.12)] bg-[rgba(255,255,255,0.44)] px-4 py-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#8c684d]">Perfil</p>
            <p className="mt-1 text-sm font-semibold capitalize text-[#3f2e25]">{producto.tipo}</p>
          </div>
          <div className="rounded-2xl border border-[rgba(121,88,66,0.12)] bg-[rgba(255,255,255,0.44)] px-4 py-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#8c684d]">Colección</p>
            <p className="mt-1 text-sm font-semibold text-[#3f2e25]">Bodega central</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => agregarProducto({ ...producto, tipo }, 1)}
            className="wood-button flex-1 rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] transition"
          >
            Añadir
          </button>
          <Link
            to={`/producto/${tipo}/${producto._id}`}
            className="wood-button-soft flex-1 rounded-2xl px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] transition hover:bg-[rgba(121,88,66,0.1)]"
          >
            Ver ficha
          </Link>
        </div>
      </div>
    </article>
  );

  if (cargando) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="panel w-full max-w-lg rounded-[2rem] p-12 text-center">
          <div className="orb mx-auto mb-5 h-20 w-20 rounded-full bg-[radial-gradient(circle,#d7b996_0%,#8d6448_58%,#4d3629_100%)] shadow-[0_20px_45px_rgba(92,61,44,0.25)]" />
          <p className="font-display text-4xl text-[#2d201a]">Preparando la selección</p>
          <p className="mt-3 text-[#6d5040]">Cargando productos con carácter y detalle.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(121,88,66,0.18)] bg-[linear-gradient(135deg,rgba(36,25,20,0.96),rgba(87,62,46,0.9)_56%,rgba(174,131,94,0.72))] px-6 py-14 text-[#fff4e6] shadow-[0_28px_70px_rgba(45,30,22,0.26)] sm:px-10 lg:px-14">
          <div className="absolute -left-10 top-8 h-48 w-48 rounded-full bg-[rgba(255,236,213,0.08)] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-[rgba(255,218,182,0.14)] blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="animate-fade-up">
              <span className="eyebrow border-[rgba(255,239,220,0.18)] bg-[rgba(255,248,240,0.08)] text-[#f2d4b2]">
                Curated Cellar
              </span>
              <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.94] text-[#fff6ea] sm:text-6xl lg:text-7xl">
                Una tienda con alma clásica y presencia contemporánea.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-[#f1decd]/90">
                Cervezas y vinos presentados como una colección editorial: cálida, refinada y hecha para transmitir calidad desde el primer vistazo.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setFiltro('todas')}
                  className="wood-button rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] transition"
                >
                  Ver selección
                </button>
                <button
                  onClick={() => setFiltro('vinos')}
                  className="rounded-full border border-[rgba(255,239,220,0.2)] bg-[rgba(255,248,240,0.08)] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fff2e0] transition hover:bg-[rgba(255,248,240,0.14)]"
                >
                  Destacar vinos
                </button>
              </div>
            </div>

            <div className="animate-fade-up delay-200">
              <div className="panel rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,252,247,0.9),rgba(241,228,210,0.74))] p-6 text-[#2d201a]">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-[1.6rem] bg-[rgba(68,49,40,0.06)] p-5">
                    <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#8c684d]">Ambiente</p>
                    <p className="mt-2 font-display text-3xl leading-none">Nogal, latón y papel fino</p>
                  </div>
                  <div className="rounded-[1.6rem] border border-[rgba(121,88,66,0.12)] bg-[rgba(255,255,255,0.46)] p-5">
                    <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#8c684d]">Dirección visual</p>
                    <p className="mt-2 text-sm text-[#5c4335]">
                      Detalle clásico, contraste elegante y superficies con profundidad sin perder limpieza comercial.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-8 rounded-[1.5rem] border border-[#d6a9a9] bg-[#fff2f2] px-5 py-4 text-[#7b3f3f] shadow-[0_12px_24px_rgba(122,63,63,0.08)]">
            {error}
          </div>
        )}

        <section className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="eyebrow">Explorar catálogo</span>
            <h2 className="mt-4 font-display text-4xl text-[#2d201a] sm:text-5xl">
              Colección principal
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { key: 'todas', label: 'Todas' },
              { key: 'cervezas', label: 'Cervezas' },
              { key: 'vinos', label: 'Vinos' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFiltro(key)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.16em] transition ${
                  filtro === key
                    ? 'wood-button text-[#fff8ef]'
                    : 'wood-button-soft hover:bg-[rgba(121,88,66,0.1)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {(filtro === 'todas' || filtro === 'cervezas') && (
          <section className="mt-10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#8c684d]">Cervezas</p>
                <h2 className="font-display text-4xl text-[#2d201a]">Maltas con identidad</h2>
              </div>
              <p className="text-sm text-[#6d5040]">{cervezas.length} referencias disponibles</p>
            </div>

            {cervezas.length === 0 ? (
              <div className="panel rounded-[1.8rem] p-10 text-center text-[#6d5040]">
                No hay cervezas disponibles.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {cervezas.map((cerveza) => (
                  <ProductoCard key={cerveza._id} producto={cerveza} tipo="cerveza" />
                ))}
              </div>
            )}
          </section>
        )}

        {(filtro === 'todas' || filtro === 'vinos') && (
          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#8c684d]">Vinos</p>
                <h2 className="font-display text-4xl text-[#2d201a]">Botellas con presencia</h2>
              </div>
              <p className="text-sm text-[#6d5040]">{vinos.length} referencias disponibles</p>
            </div>

            {vinos.length === 0 ? (
              <div className="panel rounded-[1.8rem] p-10 text-center text-[#6d5040]">
                No hay vinos disponibles.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {vinos.map((vino) => (
                  <ProductoCard key={vino._id} producto={vino} tipo="vino" />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
