const API_BASE_URL = "https://tienda-backend-tl20.onrender.com";

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
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

// Servicios de Autenticación
export const authService = {
  login: (username, password) => 
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getProfile: () => 
    apiRequest('/api/auth/profile'),
};

// Servicios de Productos
export const productService = {
  getProducts: () => 
    apiRequest('/api/productos'),

  searchProducts: (criterio, valor) => 
    apiRequest(`/api/productos/buscar?criterio=${criterio}&valor=${valor}`),

  getLowStock: () => 
    apiRequest('/api/productos/stock-bajo'),

  createProduct: (data) => 
    apiRequest('/api/productos', { method: 'POST', body: JSON.stringify(data) }),
    
  updateProduct: (id, data) => 
    apiRequest(`/api/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    
  deleteProduct: (id) => 
    apiRequest(`/api/productos/${id}`, { method: 'DELETE' })
};



// Servicios de Ventas
export const salesService = {
  createSale: (saleData) => 
    apiRequest('/api/ventas', {
      method: 'POST',
      body: JSON.stringify(saleData),
    }),
};

// Servicios de Usuarios (CU01)
export const userService = {
  getUsers: () => apiRequest('/api/usuarios'),
  createUser: (userData) => 
    apiRequest('/api/usuarios', { method: 'POST', body: JSON.stringify(userData) }),
  updateUser: (id, userData) => 
    apiRequest(`/api/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(userData) }),
  deleteUser: (id) => 
    apiRequest(`/api/usuarios/${id}`, { method: 'DELETE' })
};

// Servicios de Reportes (CU08, CU10, CU11) - UNIFICADO
export const reportService = {
  // Reporte Admin con filtros de fecha
  getAdminReport: (fechaInicio, fechaFin) => 
    apiRequest(`/api/reportes/admin?fechaInicio=${fechaInicio || ''}&fechaFin=${fechaFin || ''}`),
  
  // Reporte Cajero
  getCashierReport: (filtros = {}) => {
    // Convertimos objeto de filtros a query string: ?fechaInicio=...&montoMin=...
    const queryParams = new URLSearchParams(filtros).toString();
    return apiRequest(`/api/reportes/cajero?${queryParams}`);
  },

  getSaleDetails: (ventaId) => 
    apiRequest(`/api/reportes/venta/${ventaId}`)
};

// Servicio de Sistema (CU12)
export const systemService = {
  exportData: () => {
    const token = localStorage.getItem('token');
    return fetch(`${API_BASE_URL}/api/sistema/exportar`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(response => response.blob());
  }
};

export default apiRequest;