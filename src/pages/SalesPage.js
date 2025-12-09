import React, { useEffect, useState } from 'react';
import ProductList from '../components/products/ProductList';
import ShoppingCart from '../components/sales/ShoppingCart';
import SearchBar from '../components/common/SearchBar';
import { useProducts } from '../hooks/useProducts';
import { useSales } from '../hooks/useSales';
import TicketModal from '../components/sales/TicketModal';

const SalesPage = () => {
  // Hooks
  const { productos, loading, cargarProductos, buscarProductos } = useProducts();

  const { 
    modoVenta, 
    carrito, 
    iniciarVenta, 
    agregarAlCarrito, 
    eliminarDelCarrito, 
    calcularTotal,
    procesarVenta,
    procesando,
    metodoPago,
    setMetodoPago
  } = useSales();

  // ✅ ESTADOS PARA EL TICKET
  const [ticketData, setTicketData] = useState(null);
  const [ticketDetalles, setTicketDetalles] = useState([]);

  useEffect(() => {
    cargarProductos();
    iniciarVenta(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSale = async () => {
    const result = await procesarVenta();

    if (result.success) {
      alert(`✅ Venta Registrada!\nTicket: ${result.data.numero_venta}`);

      const total = calcularTotal();
      const subtotal = total / 1.18;
      const igv = total - subtotal;

      setTicketData({
        ...result.data,
        metodo_pago: metodoPago,
        subtotal,
        igv,
        total
      });

      setTicketDetalles(carrito);
      cargarProductos();
    } else {
      alert('❌ Error: ' + result.error);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', height: 'calc(100vh - 80px)', gap: '20px', padding: '20px' }}>
        
        {/* COLUMNA IZQUIERDA */}
        <div style={{ flex: '0 0 70%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'white', padding: '15px', borderRadius: '8px' }}>
            <SearchBar onSearch={(criterio, valor) => buscarProductos(criterio, valor)} />
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            <ProductList 
              products={productos} 
              loading={loading} 
              title="Catálogo de Venta"
              modoVenta={modoVenta}
              onAddToCart={agregarAlCarrito}
            />
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div style={{ flex: '0 0 30%', background: 'white', borderRadius: '8px', padding: '15px' }}>
          <ShoppingCart 
            carrito={carrito}
            total={calcularTotal()}
            onEliminarDelCarrito={eliminarDelCarrito}
            onProcesarVenta={handleSale}
            procesando={procesando}
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
          />
        </div>
      </div>

      {/* ✅ MODAL DEL TICKET */}
      {ticketData && (
        <TicketModal
          venta={ticketData}
          detalles={ticketDetalles}
          onClose={() => setTicketData(null)}
        />
      )}
    </>
  );
};

export default SalesPage;
