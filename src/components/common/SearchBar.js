import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
  const [criterio, setCriterio] = useState('nombre');
  const [valor, setValor] = useState('');

  const handleSearch = () => {
    if (valor.trim()) {
      onSearch(criterio, valor);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <select
        value={criterio}
        onChange={(e) => setCriterio(e.target.value)}
        style={{ 
          padding: '8px', 
          border: '1px solid #ddd', 
          borderRadius: '5px',
          fontSize: '14px'
        }}
      >
        <option value="nombre">Nombre</option>
        <option value="codigo">Código</option>
        <option value="categoria">Categoría</option>
      </select>
      
      <input
        type="text"
        placeholder="Buscar productos..."
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ 
          padding: '8px', 
          border: '1px solid #ddd', 
          borderRadius: '5px',
          fontSize: '14px',
          width: '200px'
        }}
      />
      
      <button 
        onClick={handleSearch}
        disabled={loading || !valor.trim()}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#388e3c', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px'
        }}
      >
        🔍 Buscar
      </button>
    </div>
  );
};

export default SearchBar;