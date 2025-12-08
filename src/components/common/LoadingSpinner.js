import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Cargando...' }) => {
  const sizes = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div 
        style={{
          width: sizes[size],
          height: sizes[size],
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      {text && <p style={{ marginTop: '10px', color: '#666' }}>{text}</p>}
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;