import { useState } from 'react';
import PropTypes from 'prop-types';
// 1. IMPORT the context from the new file
import { PersonaAppContext } from './PersonaAppContext';

// This file now only exports a component, which fixes the error.
export const PersonaProvider = ({ children }) => {
  const [customPersona, setCustomPersona] = useState(null);

  return (
    // 2. USE the imported context here
    <PersonaAppContext.Provider value={{ customPersona, setCustomPersona }}>
      {children}
    </PersonaAppContext.Provider>
  );
};

PersonaProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
