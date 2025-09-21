import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PersonaAppContext } from '../context/PersonaAppContext';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/Sidebar/Sidebar';
import Main from '../components/Main/Main';

// --- Pre-made persona data ---
const PREMADE_PERSONAS = {
  mochi: { id: 'mochi', name: 'Mochi', avatar: 'path/to/mochi-avatar.png' },
  doraemon: { id: 'doraemon', name: 'Doraemon', avatar: 'path/to/doraemon-avatar.png' },
  shizuka: { id: 'shizuka', name: 'Shizuka', avatar: 'path/to/shizuka-avatar.png' },
  shinchan: { id: 'shinchan', name: 'Shinchan', avatar: 'path/to/shinchan-avatar.png' },
};
// ----------------------------

function ChatPage() {
  const { personaId } = useParams();
  // FIX: Get the 'customPersonas' array from the context
  const { customPersonas } = useContext(PersonaAppContext);
  const { onSent } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPersona, setCurrentPersona] = useState(null);

  useEffect(() => {
    let personaData;
    const newPersonaFromState = location.state?.newPersona;

    if (personaId.startsWith('custom_')) {
        // If we navigated here from the form, use the state data immediately
        if (newPersonaFromState && newPersonaFromState.id === personaId) {
            personaData = newPersonaFromState;
        } else {
            // Otherwise, find it in the context (handles page refresh)
            // 'customPersonas' is now defined and this line will work
            personaData = customPersonas.find(p => p.id === personaId);
        }
    } else {
      personaData = PREMADE_PERSONAS[personaId];
    }
    
    if (!personaData) {
        navigate('/');
        return;
    }

    setCurrentPersona(personaData);
}, [personaId, customPersonas, navigate, location.state]);


  const handleSend = (prompt) => {
    if (currentPersona) {
      onSent(prompt, currentPersona);
    }
  };

  if (!currentPersona) {
    return <div className="min-h-screen bg-[#27272A] text-white flex items-center justify-center">Loading persona...</div>;
  }

  return (
    <div className="flex w-full h-screen bg-[#27272A]">
      <Sidebar />
      <Main onSent={handleSend} currentPersona={currentPersona} />
    </div>
  );
}

export default ChatPage;

