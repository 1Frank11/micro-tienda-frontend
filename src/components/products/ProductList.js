import React from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

// AÑADIMOS 'modoVenta' y 'onAddToCart' EN LOS PARAMETROS 👇
const ProductList = ({ products, loading, title, modoVenta, onAddToCart }) => {
  if (loading) {
    return <LoadingSpinner text="Cargando productos..." />;
  }

  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontSize: '20px' }}>
        {title || `📦 Productos (${products.length})`}
      </h3>
      
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          No hay productos para mostrar
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              // IMPORTANTE: PASAR ESTAS PROPS HACIA ABAJO A LA TARJETA 👇
              modoVenta={modoVenta}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;