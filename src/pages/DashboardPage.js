import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/api';

// Componentes de Páginas Secundarias
import SalesPage from './SalesPage';
import UsersPage from './UsersPage';
import AdminReportsPage from './AdminReportsPage';
import CashierReportPage from './CashierReportPage';
import AdminProductsPage from './AdminProductsPage';

// Componentes Comunes
import ProductList from '../components/products/ProductList';
import ErrorMessage from '../components/common/ErrorMessage';
import SearchBar from '../components/common/SearchBar';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('inventory'); // 'inventory', 'sales', 'users', 'reports'

  // Función para renderizar el contenido según la opción del menú
  const renderContent = () => {
    switch (currentView) {
      case 'sales': return <SalesPage />;
      case 'users': return <UsersPage />;
      case 'reports': return <AdminReportsPage />;
      case 'products-crud': return <AdminProductsPage />;
      case 'my-report': return <CashierReportPage />;
      case 'inventory': default: return <InventoryView user={user} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      
      {/* === MENÚ LATERAL (SIDEBAR) === */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: '#2c3e50', 
        color: '#ecf0f1', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #34495e' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#fff' }}>🏪 Mi Tienda</h2>
          <div style={{ marginTop: '10px', fontSize: '13px', color: '#bdc3c7' }}>
             Hola, <strong>{user.nombre_completo}</strong>
             <div style={{ 
               display: 'inline-block', 
               marginLeft: '5px',
               padding: '2px 6px', 
               borderRadius: '4px',
               background: user.rol === 'admin' ? '#2980b9' : '#27ae60',
               fontSize: '11px',
               color: 'white'
             }}>
               {user.rol.toUpperCase()}
             </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {/* Opción Común: Inventario */}
          <MenuButton 
            active={currentView === 'inventory'} 
            onClick={() => setCurrentView('inventory')} 
            icon="📦" 
            label="Ver Inventario" 
          />

          {/* Opciones CAJERO */}
          {user.rol === 'cajero' && (
            <>
                <MenuButton active={currentView === 'sales'} onClick={() => setCurrentView('sales')} icon="💰" label="Realizar Venta" />
                {/* Botón Reporte Cajero */}
                <MenuButton active={currentView === 'my-report'} onClick={() => setCurrentView('my-report')} icon="📒" label="Mis Ventas Hoy" />
            </>
          )}

          {/* Opciones ADMIN */}
          {user.rol === 'admin' && (
            <>
              {/* Botón Gestionar Productos */}
              <MenuButton active={currentView === 'products-crud'} onClick={() => setCurrentView('products-crud')} icon="🛠️" label="Gestionar Productos" />
              
              <MenuButton active={currentView === 'users'} onClick={() => setCurrentView('users')} icon="👥" label="Usuarios" />
              <MenuButton active={currentView === 'reports'} onClick={() => setCurrentView('reports')} icon="📈" label="Reportes Globales" />
            </>
          )}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #34495e' }}>
          <button 
            onClick={logout}
            style={{ 
              width: '100%', padding: '10px', background: '#c0392b', color: 'white', 
              border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' 
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* === ÁREA DE CONTENIDO PRINCIPAL === */}
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        {/* Header Superior Móvil o Título de Sección */}
        <header style={{ 
          background: 'white', padding: '15px 30px', 
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>
            {currentView === 'inventory' && '📦 Inventario General'}
            {currentView === 'sales' && '💰 Punto de Venta'}
            {currentView === 'users' && '👥 Gestión de Personal'}
            {currentView === 'reports' && '📈 Reportes del Sistema'}
          </h2>
        </header>

        <div style={{ padding: '30px' }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// === COMPONENTE AUXILIAR: BOTÓN DE MENÚ ===
const MenuButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      width: '100%', padding: '12px 15px',
      background: active ? '#34495e' : 'transparent',
      color: active ? '#3498db' : '#ecf0f1',
      border: 'none', borderRadius: '5px',
      cursor: 'pointer', textAlign: 'left',
      fontSize: '15px', transition: 'all 0.2s'
    }}
  >
    <span>{icon}</span> {label}
  </button>
);

// === COMPONENTE AUXILIAR: VISTA DE INVENTARIO (Lógica de tu antiguo Dashboard) ===
const InventoryView = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar productos al montar esta vista
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productService.getProducts();
      // Asegurar números
      const formateados = response.data.map(p => ({ ...p, precio: Number(p.precio) || 0 }));
      setProducts(formateados);
    } catch (err) {
      setError('Error cargando inventario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (criterio, valor) => {
    if (!valor.trim()) { loadProducts(); return; }
    try {
      setLoading(true);
      setError('');
      const response = await productService.searchProducts(criterio, valor);
      const formateados = response.resultados.map(p => ({ ...p, precio: Number(p.precio) || 0 }));
      setProducts(formateados);
      if (response.resultados.length === 0) setError('No se encontraron coincidencias');
    } catch (err) {
      setError('Error búsqueda: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLowStock = async () => {
    try {
      setLoading(true);
      const response = await productService.getLowStock();
      const formateados = response.alertas.map(p => ({ ...p, precio: Number(p.precio) || 0 }));
      setProducts(formateados);
      if (response.alertas.length === 0) setError('✅ Todo el stock está saludable');
    } catch (err) {
      setError('Error cargando alertas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ErrorMessage message={error} onRetry={() => setError('')} />
      
      {/* Barra de Herramientas de Inventario */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={loadProducts} style={btnToolStyle('#2196f3')}>🔄 Refrescar Todo</button>
          <button onClick={loadLowStock} style={btnToolStyle('#ff9800')}>⚠️ Ver Stock Bajo</button>
          <div style={{ flex: 1, minWidth: '300px' }}>
             <SearchBar onSearch={searchProducts} loading={loading} />
          </div>
        </div>
      </div>

      {/* Lista de Productos */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <ProductList 
          products={products} 
          loading={loading} 
          title="Listado de Artículos"
          modoVenta={false} // Aquí solo estamos VISUALIZANDO
        />
      </div>
    </div>
  );
};

// Estilo simple para botones de herramientas
const btnToolStyle = (bgColor) => ({
  padding: '10px 15px', background: bgColor, color: 'white', 
  border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
});

export default DashboardPage;