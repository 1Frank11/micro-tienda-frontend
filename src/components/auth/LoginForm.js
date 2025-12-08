import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const result = await login(username, password);
    
    if (!result.success) {
      setLoginError(result.error);
    }
    
    setLoginLoading(false);
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '40px', 
      backgroundColor: 'white', 
      borderRadius: '10px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#333', 
        marginBottom: '30px',
        fontSize: '24px'
      }}>
        🏪 Sistema de Gestión de Tienda
      </h1>
      
      <ErrorMessage message={loginError} />

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            Usuario:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu usuario"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '5px', 
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
            disabled={loginLoading}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            Contraseña:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '5px', 
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
            disabled={loginLoading}
          />
        </div>
        
        <button 
          type="submit"
          disabled={loginLoading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: loginLoading ? '#ccc' : '#1976d2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '16px', 
            cursor: loginLoading ? 'not-allowed' : 'pointer',
            marginBottom: '20px'
          }}
        >
          {loginLoading ? '🔄 Iniciando sesión...' : '🚀 Ingresar al Sistema'}
        </button>
      </form>
      
      <div style={{ 
        borderTop: '1px solid #eee', 
        paddingTop: '20px', 
        fontSize: '14px', 
        color: '#666' 
      }}>
        <p style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>
          👤 Usuarios del Sistema
        </p>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '5px',
          fontSize: '13px'
        }}>
          <p style={{ margin: '5px 0' }}>
            <strong>Administrador:</strong><br/>
            Usuario: <code>admin</code><br/>
            Contraseña: <code>admin123</code>
          </p>
          <p style={{ margin: '10px 0' }}>
            <strong>Cajeros:</strong><br/>
            Usuario: <code>cajero1</code> o <code>cajero2</code><br/>
            Contraseña: <code>cajero123</code>
          </p>
          <p style={{ 
            margin: '10px 0 0 0', 
            fontSize: '12px', 
            color: '#888',
            fontStyle: 'italic'
          }}>
            * Usuarios registrados en la base de datos PostgreSQL
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;