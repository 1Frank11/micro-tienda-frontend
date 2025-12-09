import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CashierReportPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    fechaInicio: new Date().toISOString().split('T')[0], // Por defecto hoy
    fechaFin: new Date().toISOString().split('T')[0],
    montoMin: '',
    montoMax: ''
  });

  // Estado para manejar qué fila está expandida y sus detalles
  const [expandedRow, setExpandedRow] = useState(null);
  const [detailsData, setDetailsData] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    cargarReporte();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Carga inicial (hoy)

  const cargarReporte = async () => {
    setLoading(true);
    setExpandedRow(null); // Colapsar cualquier detalle abierto al filtrar
    try {
      const result = await reportService.getCashierReport(filtros);
      if (result.success) setData(result);
    } catch (error) {
      console.error(error);
      alert("Error al cargar reporte");
    } finally {
      setLoading(false);
    }
  };

  // Función para ver/ocultar detalles
  const toggleDetails = async (ventaId) => {
    if (expandedRow === ventaId) {
      setExpandedRow(null); // Si ya está abierto, lo cerramos
      return;
    }

    setExpandedRow(ventaId);
    setLoadingDetails(true);
    try {
      const result = await reportService.getSaleDetails(ventaId);
      if (result.success) {
        setDetailsData(result.detalles);
      }
    } catch (error) {
      console.error("Error cargando detalles", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📒 Historial de Ventas</h2>
      
      {/* --- BARRA DE FILTROS --- */}
      <div style={{ 
        background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px',
        display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'end', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div>
          <label style={labelStyle}>Desde:</label>
          <input type="date" value={filtros.fechaInicio} onChange={e => setFiltros({...filtros, fechaInicio: e.target.value})} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Hasta:</label>
          <input type="date" value={filtros.fechaFin} onChange={e => setFiltros({...filtros, fechaFin: e.target.value})} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Mín (S/):</label>
          <input type="number" placeholder="0.00" value={filtros.montoMin} onChange={e => setFiltros({...filtros, montoMin: e.target.value})} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Máx (S/):</label>
          <input type="number" placeholder="Sin límite" value={filtros.montoMax} onChange={e => setFiltros({...filtros, montoMax: e.target.value})} style={inputStyle} />
        </div>
        <button onClick={cargarReporte} style={btnStyle}>🔍 Filtrar</button>
      </div>

      {loading && <LoadingSpinner text="Consultando ventas..." />}

      {!loading && data && (
        <>
          {/* Tarjeta de Resumen (Se actualiza con los filtros) */}
          <div style={{ 
            background: 'white', padding: '20px', borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px',
            borderLeft: '5px solid #2196f3', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#555' }}>Resumen de Búsqueda</h3>
                <small style={{color:'#888'}}>Según filtros aplicados</small>
            </div>
            <div style={{ display: 'flex', gap: '40px' }}>
              <div style={{textAlign: 'right'}}>
                <small style={{ color: '#888' }}>Total Recaudado</small>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>
                  S/ {data.resumen.total_recaudado.toFixed(2)}
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <small style={{ color: '#888' }}>Transacciones</small>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1565c0' }}>
                  {data.resumen.cantidad_transacciones}
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Ventas Interactiva */}
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f5f5f5' }}>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Fecha y Hora</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Ticket</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Método</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>Total</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {data.ventas.map((venta) => (
                  <React.Fragment key={venta.id}>
                    {/* FILA PRINCIPAL */}
                    <tr style={{ borderBottom: '1px solid #eee', background: expandedRow === venta.id ? '#e3f2fd' : 'white' }}>
                      <td style={{ padding: '15px' }}>
                        {new Date(venta.fecha_venta).toLocaleDateString()} <br/>
                        <small style={{color:'#666'}}>{new Date(venta.fecha_venta).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                      </td>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>{venta.numero_venta}</td>
                      <td style={{ padding: '15px' }}>
                          <span style={{ 
                              padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                              background: venta.metodo_pago === 'efectivo' ? '#e8f5e9' : '#fff3e0',
                              color: venta.metodo_pago === 'efectivo' ? '#2e7d32' : '#f57c00',
                              border: '1px solid rgba(0,0,0,0.05)'
                          }}>
                              {venta.metodo_pago ? venta.metodo_pago.toUpperCase() : 'EFECTIVO'}
                          </span>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>
                        S/ {Number(venta.total).toFixed(2)}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <button 
                            onClick={() => toggleDetails(venta.id)}
                            style={{ 
                                background: 'transparent', border: '1px solid #2196f3', color: '#2196f3',
                                borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            {expandedRow === venta.id ? '➖' : '➕'}
                        </button>
                      </td>
                    </tr>

                    {/* FILA DE DETALLES (Se muestra si está expandida) */}
                    {expandedRow === venta.id && (
                        <tr>
                            <td colSpan="5" style={{ background: '#f8f9fa', padding: '20px' }}>
                                {loadingDetails ? (
                                    <div style={{textAlign: 'center', color: '#666'}}>Cargando productos...</div>
                                ) : (
                                    <div style={{ maxWidth: '90%', margin: '0 auto', background: 'white', borderRadius: '8px', padding: '15px', border: '1px solid #ddd' }}>
                                        <h4 style={{marginTop: 0, color: '#333'}}>🛒 Productos en Ticket {venta.numero_venta}</h4>
                                        <table style={{width: '100%', fontSize: '14px'}}>
                                            <thead>
                                                <tr style={{color: '#666', borderBottom: '2px solid #eee'}}>
                                                    <th style={{textAlign:'left', paddingBottom:'10px'}}>Producto</th>
                                                    <th style={{textAlign:'center', paddingBottom:'10px'}}>Cant.</th>
                                                    <th style={{textAlign:'right', paddingBottom:'10px'}}>P. Unit</th>
                                                    <th style={{textAlign:'right', paddingBottom:'10px'}}>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {detailsData.map((d, idx) => (
                                                    <tr key={idx} style={{borderBottom: '1px solid #eee'}}>
                                                        <td style={{padding: '8px 0'}}>
                                                            {d.nombre} <br/>
                                                            <small style={{color:'#999'}}>{d.codigo}</small>
                                                        </td>
                                                        <td style={{textAlign:'center'}}>{d.cantidad}</td>
                                                        <td style={{textAlign:'right'}}>S/ {Number(d.precio_unitario).toFixed(2)}</td>
                                                        <td style={{textAlign:'right', fontWeight:'bold'}}>S/ {Number(d.subtotal).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </td>
                        </tr>
                    )}
                  </React.Fragment>
                ))}
                
                {data.ventas.length === 0 && (
                  <tr><td colSpan="5" style={{padding:'30px', textAlign:'center', color:'#888'}}>No se encontraron ventas con estos filtros</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

// Estilos rápidos
const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' };
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '130px' };
const btnStyle = { 
    background: '#1976d2', color: 'white', border: 'none', padding: '8px 20px', 
    borderRadius: '4px', cursor: 'pointer', height: '36px', fontWeight: 'bold' 
};

export default CashierReportPage;