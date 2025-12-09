import React, { useState, useEffect } from 'react';
import { reportService, systemService, adminService } from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const AdminReportsPage = () => {
  const [ventasCajeros] = useState([]);
  const [dates, setDates] = useState({ inicio: '', fin: '' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const result = await reportService.getAdminReport(dates.inicio, dates.fin);
      if (result.success) setData(result);
    } catch (error) {
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await systemService.exportData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${new Date().toISOString()}.json`;
      a.click();
    } catch {
      alert("Error al exportar");
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f6f8fb', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: 20 }}>📊 Reportes Administrativos</h2>

      {/* FILTROS */}
      <div style={{
        background: 'white',
        padding: 16,
        borderRadius: 10,
        marginBottom: 30,
        display: 'flex',
        gap: 16,
        alignItems: 'end',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div>
          <span style={{ fontSize: 12 }}>Desde</span>
          <input type="date" value={dates.inicio}
            onChange={e => setDates({ ...dates, inicio: e.target.value })} />
        </div>

        <div>
          <span style={{ fontSize: 12 }}>Hasta</span>
          <input type="date" value={dates.fin}
            onChange={e => setDates({ ...dates, fin: e.target.value })} />
        </div>

        <button onClick={fetchReport} disabled={loading}
          style={{
            background: loading ? '#90caf9' : '#2196f3',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: 6
          }}>
          {loading ? "⏳ Cargando..." : "🔍 Generar Reporte"}
        </button>

        <button onClick={handleExport}
          style={{
            marginLeft: 'auto',
            background: '#607d8b',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: 6
          }}>
          💾 Exportar Datos
        </button>
      </div>

      {data && (
        <>
          {/* KPIs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            marginBottom: 40
          }}>
            <Card title="Ventas Totales" value={`S/ ${data.kpi?.total_dinero}`} color="#4caf50" />
            <Card title="Transacciones" value={data.kpi?.cantidad} color="#2196f3" />
            <Card title="Producto Top" value={data.top_productos?.[0]?.nombre} color="#ff9800" />
          </div>

          {/* GRÁFICOS GRANDES */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))',
            gap: 28,
            marginBottom: 40
          }}>

            {/* Ventas por Día */}
            <Panel title="📈 Ventas por Día">
              <ResponsiveContainer width="100%" height={420}>
                <LineChart data={data.grafico_dias}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" name="Total S/." stroke="#2196f3" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>

            {/* Top Productos */}
            <Panel title="🏆 Top Productos">
              <ResponsiveContainer width="100%" height={420}>
                <BarChart data={data.top_productos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad_vendida" name="Unidades" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            {/* Ventas por Cajero */}
            <Panel title="👤 Ventas por Cajero">
              <ResponsiveContainer width="100%" height={420}>
                <BarChart data={data.cajeros}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="username" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_vendido" name="S/ Vendido" fill="#ff9800" />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            {/* NUEVO GRÁFICO PROFESIONAL */}
            <Panel title="📊 Dinero vs Transacciones por Cajero">
              <ResponsiveContainer width="100%" height={420}>
                <BarChart data={data.cajeros}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="username" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="transacciones" name="N° Ventas" fill="#2196f3" />
                  <Bar dataKey="total_vendido" name="Total S/." fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

          </div>

          {/* TABLAS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))',
            gap: 28
          }}>
            <TableBox title="📋 Ventas por Cajero">
              <table width="100%">
                <thead>
                  <tr>
                    <th>Cajero</th>
                    <th>Ventas</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.cajeros?.map((c, i) => (
                    <tr key={i}>
                      <td>{c.username}</td>
                      <td>{c.transacciones}</td>
                      <td>S/ {c.total_vendido}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableBox>

            <TableBox title="🏆 Productos más vendidos">
              <ul>
                {data.top_productos?.map((p, i) => (
                  <li key={i} style={listRow}>
                    <span>{p.nombre}</span>
                    <strong>{p.cantidad_vendida} und.</strong>
                  </li>
                ))}
              </ul>
            </TableBox>
          </div>
        </>
      )}
    </div>
  );
};

/* === COMPONENTES VISUALES === */

const Panel = ({ title, children }) => (
  <div style={{
    background: 'white',
    padding: 22,
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  }}>
    <h3 style={{ marginBottom: 12 }}>{title}</h3>
    {children}
  </div>
);

const TableBox = ({ title, children }) => (
  <div style={panelStyle}>
    <h3>{title}</h3>
    {children}
  </div>
);

const panelStyle = {
  background: 'white',
  padding: 20,
  borderRadius: 10,
  boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
};

const listRow = {
  padding: '10px',
  borderBottom: '1px solid #eee',
  display: 'flex',
  justifyContent: 'space-between'
};

const Card = ({ title, value, color }) => (
  <div style={{
    background: 'white',
    padding: 20,
    borderRadius: 10,
    borderLeft: `6px solid ${color}`,
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
  }}>
    <div style={{ color: '#666', fontSize: 14 }}>{title}</div>
    <div style={{ fontSize: 26, fontWeight: 'bold' }}>{value}</div>
  </div>
);

export default AdminReportsPage;
