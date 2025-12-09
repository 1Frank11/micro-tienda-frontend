import axios from "axios";

/* ===============================
   CONFIGURACIÓN BASE
================================ */
const API_BASE_URL = "http://localhost:3001";

/* ===============================
   FETCH WRAPPER CON TOKEN
================================ */
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: options.body || null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      console.error("BACKEND ERROR:", data);
      throw data;
    }

    return data;
  } catch (error) {
    console.error("API REQUEST ERROR:", error);
    throw error;
  }
};

/* ===============================
   AUTH
================================ */
export const authService = {
  login: (username, password) => 
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getProfile: () => 
    apiRequest('/api/auth/profile')
};

/* ===============================
   PRODUCTOS
================================ */
export const productService = {
  getProducts: () => apiRequest('/api/productos'),

  searchProducts: (criterio, valor) => 
    apiRequest(`/api/productos/buscar?criterio=${criterio}&valor=${valor}`),

  getLowStock: () => apiRequest('/api/productos/stock-bajo'),

  createProduct: (data) => 
    apiRequest('/api/productos', { method: 'POST', body: JSON.stringify(data) }),

  updateProduct: (id, data) => 
    apiRequest(`/api/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteProduct: (id) => 
    apiRequest(`/api/productos/${id}`, { method: 'DELETE' })
};

/* ===============================
   VENTAS
================================ */
export const salesService = {
  createSale: (saleData) =>
    apiRequest('/api/ventas', {
      method: 'POST',
      body: JSON.stringify(saleData)
    }),

  getTicket: (ventaId) =>
    apiRequest(`/api/ventas/ticket/${ventaId}`)
};

/* ===============================
   USUARIOS
================================ */
export const userService = {
  getUsers: () => apiRequest('/api/usuarios'),

  createUser: (userData) => 
    apiRequest('/api/usuarios', { method: 'POST', body: JSON.stringify(userData) }),

  updateUser: (id, userData) => 
    apiRequest(`/api/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(userData) }),

  deleteUser: (id) => 
    apiRequest(`/api/usuarios/${id}`, { method: 'DELETE' })
};

/* ===============================
   REPORTES (UNO SOLO)
================================ */
const API_REPORTES = `${API_BASE_URL}/api/reportes`;

export const reportService = {
  // ✅ Reporte Admin
  getAdminReport: (fechaInicio, fechaFin) => 
    apiRequest(`/api/reportes/admin?fechaInicio=${fechaInicio || ''}&fechaFin=${fechaFin || ''}`),

  // ✅ Reporte Cajero
  getCashierReport: (filtros = {}) => {
    const queryParams = new URLSearchParams(filtros).toString();
    return apiRequest(`/api/reportes/cajero?${queryParams}`);
  },

  // ✅ Detalle de venta
  getSaleDetails: (ventaId) => 
    apiRequest(`/api/reportes/venta/${ventaId}`),

  // ✅ EXPORTAR A EXCEL (BLOB REAL)
exportExcel: async (filtros) => {
    return axios.get(
      "http://localhost:3001/api/reportes/exportar-excel",
      {
        params: filtros,
        responseType: "blob", // OBLIGATORIO
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
    }
  
};
/* ===============================
   SISTEMA
================================ */
export const systemService = {
  exportData: async () => {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}/api/sistema/exportar`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.blob();
  }
};

export default apiRequest;
