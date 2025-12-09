import React, { useEffect, useState } from "react";
import { reportService } from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid
} from "recharts";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: ""
  });

  const cargarDashboard = async () => {
    setLoading(true);
    try {
      const res = await reportService.getAdminReport(
        filtros.fechaInicio,
        filtros.fechaFin
      );

      if (res.success) setData(res);
    } catch (error) {
      console.error(error);
      alert("Error al cargar dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Cargando dashboard...</p>;
  if (!data) return null;

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Dashboard Administrativo</h2>

      {/* ✅ FILTROS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="date"
          value={filtros.fechaInicio}
          onChange={e => setFiltros({ ...filtros, fechaInicio: e.target.value })}
        />
        <input
          type="date"
          value={filtros.fechaFin}
          onChange={e => setFiltros({ ...filtros, fechaFin: e.target.value })}
        />
        <button onClick={cargarDashboard}>🔍 Generar</button>
      </div>

      {/* ✅ KPIs */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <Card titulo="Total Ventas" valor={`S/ ${data.kpi.total_dinero}`} />
        <Card titulo="Transacciones" valor={data.kpi.cantidad} />
        <Card
          titulo="Producto Top"
          valor={data.top_productos[0]?.nombre || "—"}
        />
        <Card
          titulo="Cajero Top"
          valor={data.cajeros[0]?.username || "—"}
        />
      </div>

      {/* ✅ GRÁFICO DE VENTAS POR DÍA */}
      <h3>📈 Ventas por Día</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data.grafico_dias}>
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ PRODUCTOS MÁS VENDIDOS */}
      <h3 style={{ marginTop: 40 }}>🏆 Productos más vendidos</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data.top_productos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad_vendida" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ RENDIMIENTO DE CAJEROS */}
      <h3 style={{ marginTop: 40 }}>👤 Rendimiento de Cajeros</h3>
      <table style={{ width: "100%", marginTop: 10 }}>
        <thead>
          <tr>
            <th>Cajero</th>
            <th>Transacciones</th>
            <th>Total Vendido</th>
          </tr>
        </thead>
        <tbody>
          {data.cajeros.map((c, i) => (
            <tr key={i}>
              <td>{c.username}</td>
              <td>{c.transacciones}</td>
              <td>S/ {c.total_vendido}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Card = ({ titulo, valor }) => (
  <div style={{
    background: "white",
    padding: 20,
    borderRadius: 10,
    minWidth: 180,
    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)"
  }}>
    <h4>{titulo}</h4>
    <h2>{valor}</h2>
  </div>
);

export default AdminDashboard;
