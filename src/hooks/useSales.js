import { useState } from 'react';
import { salesService } from '../services/api';
export const useSales = () => {
  const [modoVenta, setModoVenta] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [procesando, setProcesando] = useState(false); 
  const [metodoPago, setMetodoPago] = useState('efectivo');

  const iniciarVenta = () => {
    setModoVenta(true);
    setCarrito([]);
    setMetodoPago('efectivo');
  };

  const cancelarVenta = () => {
    setModoVenta(false);
    setCarrito([]);
  };

  const agregarAlCarrito = (producto) => {
    if (!modoVenta) return false;
    
    const productoEnCarrito = carrito.find(item => item.id === producto.id);
    
    if (productoEnCarrito) {
      if (productoEnCarrito.cantidad >= producto.stock) {
        alert('❌ No hay más stock disponible para este producto');
        return false;
      }

      setCarrito(carrito.map(item => 
        item.id === producto.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));

    } else {
      if (producto.stock < 1) {
        alert('❌ Producto sin stock');
        return false;
      }

      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }

    return true;
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.id !== productoId));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const procesarVenta = async () => {
    if (carrito.length === 0) return { success: false, error: "Carrito vacío" };
    
    setProcesando(true);
    try {
      const saleData = {
        items: carrito.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad
        })),
        metodo_pago: metodoPago
      };

      const response = await salesService.createSale(saleData);
      
      setCarrito([]);
      setModoVenta(false);
      return { success: true, data: response };

    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setProcesando(false);
    }
  };


  return {
    modoVenta,
    carrito,
    procesando,
    metodoPago,
    setMetodoPago, 
    iniciarVenta,
    cancelarVenta,
    agregarAlCarrito,
    eliminarDelCarrito,
    calcularTotal,
    procesarVenta 
  };
};