import { useState } from 'react';

export const useProducts = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch('/api/productos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al cargar productos');
      
      const data = await response.json();
      
      if (data.success) {
        const productosFormateados = data.data.map(producto => ({
          ...producto,
          precio: Number(producto.precio) || 0
        }));
        setProductos(productosFormateados);
      }
    } catch (error) {
      setError('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const buscarProductos = async (criterio, valor) => {
    if (!valor.trim()) {
      setError('Ingresa un término de búsqueda');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/productos/buscar?criterio=${criterio}&valor=${valor}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        const productosFormateados = data.resultados.map(producto => ({
          ...producto,
          precio: Number(producto.precio) || 0
        }));
        setProductos(productosFormateados);
        if (data.resultados.length === 0) {
          setError('No se encontraron productos');
        }
      }
    } catch (error) {
      setError('Error al buscar productos');
    } finally {
      setLoading(false);
    }
  };

  const verStockBajo = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch('/api/productos/stock-bajo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        const productosFormateados = data.alertas.map(producto => ({
          ...producto,
          precio: Number(producto.precio) || 0
        }));
        setProductos(productosFormateados);
        
        if (data.alertas.length === 0) {
          setError('✅ No hay productos con stock bajo');
        }
      }
    } catch (error) {
      setError('Error al cargar stock bajo');
    } finally {
      setLoading(false);
    }
  };

  return {
    productos,
    loading,
    error,
    setError,
    cargarProductos,
    buscarProductos,
    verStockBajo
  };
};