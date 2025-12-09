import React from 'react';

const ProductCard = ({ product, modoVenta, onAddToCart }) => {

  const sinStock = product.stock === 0;

  const handleClick = () => {
    if (!modoVenta) return;

    if (sinStock) {
      alert('❌ Este producto no tiene stock disponible');
      return;
    }

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div 
      onClick={handleClick}
      style={{ 
        border: `1px solid ${
          sinStock ? '#d32f2f' : product.stock <= product.stock_minimo ? '#ffa726' : '#e0e0e0'
        }`,
        borderRadius: '8px', 
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: sinStock
          ? '#ffebee'
          : product.stock <= product.stock_minimo 
            ? '#fff3e0' 
            : 'white',
        cursor: modoVenta && !sinStock ? 'pointer' : 'not-allowed',
        opacity: sinStock ? 0.6 : 1,
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333', marginBottom: '5px' }}>
          {product.nombre} 
          <span style={{ 
            fontSize: '12px', 
            backgroundColor: '#e3f2fd', 
            color: '#1976d2',
            padding: '2px 8px',
            borderRadius: '10px',
            marginLeft: '10px'
          }}>
            {product.codigo}
          </span>

          {modoVenta && !sinStock && (
            <span style={{ 
              fontSize: '12px', 
              backgroundColor: '#4caf50', 
              color: 'white',
              padding: '2px 8px',
              borderRadius: '10px',
              marginLeft: '10px'
            }}>
              👆 Click para agregar
            </span>
          )}

          {sinStock && (
            <span style={{ 
              fontSize: '12px', 
              backgroundColor: '#d32f2f', 
              color: 'white',
              padding: '2px 8px',
              borderRadius: '10px',
              marginLeft: '10px'
            }}>
              ❌ Sin stock
            </span>
          )}
        </div>

        <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
          {product.categoria} 
          {product.ubicacion && ` • ${product.ubicacion}`}
        </div>

        {product.descripcion && (
          <div style={{ color: '#888', fontSize: '13px' }}>
            {product.descripcion}
          </div>
        )}
      </div>
      
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px' }}>
          S/ {typeof product.precio === 'number' ? product.precio.toFixed(2) : '0.00'}
        </div>

        <div style={{ 
          fontSize: '14px', 
          color: sinStock ? '#d32f2f' : product.stock <= product.stock_minimo ? '#f57c00' : '#666',
          fontWeight: product.stock <= product.stock_minimo ? 'bold' : 'normal'
        }}>
          Stock: {product.stock} 
          {product.stock_minimo && ` (Mín: ${product.stock_minimo})`}
          {product.stock <= product.stock_minimo && !sinStock && ' ⚠️'}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
