import React, { useState, useEffect } from 'react';
import { reportService, systemService } from '../services/api';

const AdminReportsPage = () => {
  // Inicializamos fechas vacías
  const [dates, setDates] = useState({ inicio: '', fin: '' });
  const [data, setData] = useState(null);
  
  // ESTADO NUEVO: Para saber si está cargando y bloquear el botón
  const [loading, setLoading] = useState(false);

  // Cargar datos al entrar a la página
  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReport = async () => {
    console.log("🔄 Click en generar reporte..."); // PARA QUE VEAS QUE SI FUNCIONA
    setLoading(true); // Activamos modo carga
    
    try {
      const result = await reportService.getAdminReport(dates.inicio, dates.fin);
      console.log("✅ Datos recibidos del backend:", result);
      
      if (result.success) {
        setData(result);
      } else {
        alert("El servidor respondió pero sin éxito");
      }
    } catch (error) {
      console.error("❌ Error conectando:", error);
      alert("Error al conectar con el servidor de reportes");
    } finally {
      setLoading(false); // Desactivamos modo carga siempre
    }
  };

  const handleExport = async () => {
      try {
        const blob = await systemService.exportData();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_sistema_${new Date().toISOString()}.json`;
        a.click();
      } catch (error) {
        alert("Error al exportar datos");
      }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📈 Reportes Administrativos</h2>
      
      {/* Filtros */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div>
            <span style={{fontSize: '12px', color: '#666', display: 'block'}}>Desde:</span>
            <input type="date" value={dates.inicio} onChange={e => setDates({...dates, inicio: e.target.value})} />
        </div>
        
        <div>
            <span style={{fontSize: '12px', color: '#666', display: 'block'}}>Hasta:</span>
            <input type="date" value={dates.fin} onChange={e => setDates({...dates, fin: e.target.value})} />
        </div>

        {/* BOTÓN MEJORADO CON ESTADO DE CARGA */}
        <button 
            onClick={fetchReport} 
            disabled={loading}
            style={{ 
                background: loading ? '#90caf9' : '#2196f3', // Cambia de color si carga
                color: 'white', 
                border: 'none', 
                padding: '8px 15px', 
                borderRadius: '4px', 
                cursor: loading ? 'wait' : 'pointer',
                fontWeight: 'bold',
                height: '38px',
                marginTop: '14px' // Para alinear con los inputs
            }}
        >
          {loading ? '⏳ Cargando...' : '🔍 Generar Reporte'}
        </button>

        <button onClick={handleExport} style={{ marginLeft: 'auto', background: '#607d8b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', height: '38px', marginTop: '14px' }}>
          💾 Exportar Datos
        </button>
      </div>

      {data && (
        <>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <Card 
                title="Ventas Totales" 
                value={`S/ ${data.kpi?.total_dinero || '0.00'}`} 
                color="#4caf50" 
            />
            <Card 
                title="Transacciones" 
                value={data.kpi?.cantidad || 0} 
                color="#2196f3" 
            />
            <Card 
                title="Producto Top" 
                value={data.top_productos?.[0]?.nombre || 'Sin datos'} 
                color="#ff9800" 
            />
            <Card 
                title="Cajero Top" 
                value={data.cajeros?.[0]?.username || 'Sin datos'} 
                color="#9c27b0" 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
             {/* Lista Top Productos */}
             <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>🏆 Productos más vendidos</h3>
                <ul>
                  {data.top_productos?.map((p, i) => (
                    <li key={i} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{p.nombre}</span>
                      <strong>{p.cantidad_vendida} und.</strong>
                    </li>
                  ))}
                  {data.top_productos?.length === 0 && <li style={{padding:'10px'}}>No hay datos</li>}
                </ul>
             </div>
             
             {/* Rendimiento Cajeros */}
             <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h3>👤 Rendimiento Cajeros</h3>
                <ul>
                  {data.cajeros?.map((c, i) => (
                    <li key={i} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{c.username}</span>
                      <span>{c.transacciones} ventas (S/ {c.total_vendido})</span>
                    </li>
                  ))}
                   {data.cajeros?.length === 0 && <li style={{padding:'10px'}}>No hay datos</li>}
                </ul>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div style={{ background: 'white', padding: '20px', borderRadius: '8px', borderLeft: `5px solid ${color}`, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
    <div style={{ color: '#666', fontSize: '14px' }}>{title}</div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{value}</div>
  </div>
);

export default AdminReportsPage;