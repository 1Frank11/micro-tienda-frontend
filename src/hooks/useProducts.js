import { useState } from 'react';
import { productService } from '../services/api';

export const useProducts = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarProductos = async () => {
  try {
    setLoading(true);
    setError('');
    const response = await productService.getProducts(); // GET al backend real
    const productosFormateados = response.data.map(p => ({
      ...p,
      precio: Number(p.precio) || 0
    }));
    setProductos(productosFormateados);
  } catch (err) {
    setError('Error: ' + err.message);
  } finally {
    setLoading(false);
  }
};

const buscarProductos = async (criterio, valor) => {
  if (!valor.trim()) { setError('Ingresa un término de búsqueda'); return; }
  try {
    setLoading(true);
    setError('');
    const response = await productService.searchProducts(criterio, valor);
    const productosFormateados = response.resultados.map(p => ({
      ...p,
      precio: Number(p.precio) || 0
    }));
    setProductos(productosFormateados);
    if (response.resultados.length === 0) setError('No se encontraron productos');
  } catch (err) {
    setError('Error al buscar productos');
  } finally {
    setLoading(false);
  }
};

const verStockBajo = async () => {
  try {
    setLoading(true);
    setError('');
    const response = await productService.getLowStock();
    const productosFormateados = response.alertas.map(p => ({
      ...p,
      precio: Number(p.precio) || 0
    }));
    setProductos(productosFormateados);
    if (response.alertas.length === 0) setError('No hay productos con stock bajo');
  } catch (err) {
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