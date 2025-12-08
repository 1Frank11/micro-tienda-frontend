import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    codigo: '', nombre: '', precio: '', stock: '', 
    stock_minimo: '', categoria_id: 1, ubicacion: '', descripcion: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts();
      if (res.success) setProducts(res.data);
    } catch (error) {
      alert("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await productService.updateProduct(formData.id, formData);
        alert('✅ Producto actualizado');
      } else {
        await productService.createProduct(formData);
        alert('✅ Producto creado');
      }
      setShowModal(false);
      loadProducts(); // Recargar tabla
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productService.deleteProduct(id);
        loadProducts();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  const openNew = () => {
    setFormData({ codigo: '', nombre: '', precio: '', stock: '', stock_minimo: 5, categoria_id: 1, ubicacion: '', descripcion: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEdit = (prod) => {
    setFormData({ ...prod });
    setIsEditing(true);
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner text="Cargando inventario..." />;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>🛠️ Gestión de Productos</h2>
        <button onClick={openNew} style={{ background: '#2196f3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
          + Nuevo Producto
        </button>
      </div>

      {/* TABLA CRUD */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Código</th>
            <th style={{ padding: '12px' }}>Producto</th>
            <th style={{ padding: '12px' }}>Precio</th>
            <th style={{ padding: '12px' }}>Stock</th>
            <th style={{ padding: '12px' }}>Categoría</th>
            <th style={{ padding: '12px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>{p.codigo}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.nombre}</td>
              <td style={{ padding: '12px' }}>S/ {Number(p.precio).toFixed(2)}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ color: p.stock <= p.stock_minimo ? 'red' : 'green', fontWeight: 'bold' }}>
                  {p.stock}
                </span>
              </td>
              <td style={{ padding: '12px' }}>{p.categoria}</td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => openEdit(p)} style={{ marginRight: '10px', cursor: 'pointer' }}>✏️</button>
                <button onClick={() => handleDelete(p.id)} style={{ cursor: 'pointer' }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL FORMULARIO */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              
              <div style={{ gridColumn: 'span 2' }}>
                <label>Nombre:</label>
                <input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} style={inputStyle} />
              </div>

              <div>
                <label>Código:</label>
                <input required value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value})} style={inputStyle} />
              </div>

              <div>
                <label>Categoría ID:</label>
                <input type="number" required value={formData.categoria_id} onChange={e => setFormData({...formData, categoria_id: e.target.value})} style={inputStyle} />
              </div>

              <div>
                <label>Precio (S/):</label>
                <input type="number" step="0.01" required value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} style={inputStyle} />
              </div>

              <div>
                <label>Stock Actual:</label>
                <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={inputStyle} />
              </div>

              <div>
                <label>Stock Mínimo:</label>
                <input type="number" required value={formData.stock_minimo} onChange={e => setFormData({...formData, stock_minimo: e.target.value})} style={inputStyle} />
              </div>

              <div>
                <label>Ubicación:</label>
                <input value={formData.ubicacion} onChange={e => setFormData({...formData, ubicacion: e.target.value})} style={inputStyle} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label>Descripción:</label>
                <textarea value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} style={{...inputStyle, height: '60px'}} />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '5px' };

export default AdminProductsPage;