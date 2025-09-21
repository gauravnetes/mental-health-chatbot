import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PersonaAppContext } from './PersonaAppContext';

export const PersonaProvider = ({ children }) => {
  const [customPersonas, setCustomPersonas] = useState(() => {
    const saved = localStorage.getItem('customPersonas');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('customPersonas', JSON.stringify(customPersonas));
  }, [customPersonas]);

  const addCustomPersona = (newPersona) => {
    setCustomPersonas(prev => [newPersona, ...prev]);
  };

  const contextValue = { customPersonas, addCustomPersona };

  return (
    <PersonaAppContext.Provider value={contextValue}>
      {children}
    </PersonaAppContext.Provider>
  );
};

PersonaProvider.propTypes = {
    children: PropTypes.node.isRequired,
};