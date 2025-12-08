import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div style={{
      backgroundColor: '#ffebee',
      border: '1px solid #f5c6cb',
      color: '#721c24',
      padding: '15px',
      borderRadius: '5px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <strong>⚠️ Error:</strong> {message}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;