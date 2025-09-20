import { useState } from 'react';
import PropTypes from 'prop-types';
import { PersonaAppContext } from './PersonaAppContext';

export const PersonaProvider = ({ children }) => {
  const [customPersona, setCustomPersona] = useState(null);

  return (
    <PersonaAppContext.Provider value={{ customPersona, setCustomPersona }}>
      {children}
    </PersonaAppContext.Provider>
  );
};

PersonaProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
