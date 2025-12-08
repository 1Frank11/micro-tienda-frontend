import React from 'react';


const ShoppingCart = ({ 
  carrito, 
  onEliminarDelCarrito, 
  total, 
  onProcesarVenta, 
  procesando,
  metodoPago, 
  setMetodoPago 
}) => {
  
  
  if (carrito.length === 0) return null;

  return (
    <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '5px', border: '1px solid #90caf9' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>🛒 Carrito de Venta</h4>
      
      {/* ... Lista de items (se mantiene igual) ... */}
      {carrito.map(item => (
         <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom:'1px dashed #ccc', paddingBottom:'5px' }}>
           <div>
             <div>{item.nombre}</div>
             <small>x{item.cantidad} (S/ {item.precio})</small>
           </div>
           <div>
             <strong>S/ {(item.precio * item.cantidad).toFixed(2)}</strong>
             <button onClick={() => onEliminarDelCarrito(item.id)} style={{marginLeft:'5px', border:'none', background:'transparent', cursor:'pointer'}}>❌</button>
           </div>
         </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #1565c0' }}>
        <strong style={{ color: '#1565c0' }}>Total a Pagar:</strong>
        <strong style={{ color: '#1565c0', fontSize: '18px' }}>S/ {total.toFixed(2)}</strong>
      </div>

      {/* SELECTOR DE PAGO */}
      <div style={{ marginTop: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Método de Pago:</label>
        <select 
          value={metodoPago} 
          onChange={(e) => setMetodoPago(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          {/* IMPORTANTE: Los values deben ser idénticos a los de tu BD (minúsculas) */}
          <option value="efectivo">💵 Efectivo</option>
          <option value="tarjeta">💳 Tarjeta</option>
          <option value="transferencia">📱 Transferencia</option>
        </select>
      </div>

      <button 
        onClick={onProcesarVenta}
        disabled={procesando || carrito.length === 0}
        style={{
          width: '100%',
          padding: '12px',
          marginTop: '15px',
          backgroundColor: procesando ? '#ccc' : '#2e7d32',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: procesando ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: '16px'
        }}
      >
        {procesando ? '⏳ Procesando...' : '✅ Finalizar Venta'}
      </button>
    </div>
  );
};

export default ShoppingCart;