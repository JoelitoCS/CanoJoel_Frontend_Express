import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Cargar carrito del localStorage
  useEffect(() => {
    const carrito = localStorage.getItem('carrito');
    if (carrito) {
      try {
        setItems(JSON.parse(carrito));
      } catch (err) {
        console.error('Error cargando carrito:', err);
      }
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const agregarProducto = (producto, cantidad = 1) => {
    setItems((prevItems) => {
      const existe = prevItems.find(
        (item) => item.productoId === producto._id && item.tipo === producto.tipo
      );

      if (existe) {
        return prevItems.map((item) =>
          item.productoId === producto._id && item.tipo === producto.tipo
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }

      return [
        ...prevItems,
        {
          productoId: producto._id,
          nombre: producto.nombre,
          tipo: producto.tipo,
          cantidad,
        },
      ];
    });
  };

  const actualizarCantidad = (productoId, tipo, cantidad) => {
    if (cantidad <= 0) {
      eliminarProducto(productoId, tipo);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productoId === productoId && item.tipo === tipo
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const eliminarProducto = (productoId, tipo) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.productoId === productoId && item.tipo === tipo)
      )
    );
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  const obtenerTotal = () => items.length;

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarProducto,
        actualizarCantidad,
        eliminarProducto,
        vaciarCarrito,
        obtenerTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};
