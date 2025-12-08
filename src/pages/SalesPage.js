import React, { useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import ShoppingCart from '../components/sales/ShoppingCart';
import SearchBar from '../components/common/SearchBar';
import { useProducts } from '../hooks/useProducts';
import { useSales } from '../hooks/useSales';

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

 useEffect(() => {
    cargarProductos();
    iniciarVenta(); 
    // AGREGAR ESTA LÍNEA EXACTAMENTE ABAJO:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSale = async () => {
    const result = await procesarVenta();
    if (result.success) {
      alert(`✅ Venta Registrada!\nTicket: ${result.data.numero_venta}`);
      cargarProductos(); // Recargar para actualizar stock visualmente
    } else {
      alert('❌ Error: ' + result.error);
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', gap: '20px', padding: '20px' }}>
      
      {/* COLUMNA IZQUIERDA: Catálogo (70%) */}
      <div style={{ flex: '0 0 70%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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

      {/* COLUMNA DERECHA: Carrito */}
      <div style={{ flex: '0 0 30%', background: 'white', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column' }}>
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
  );
};

export default SalesPage;