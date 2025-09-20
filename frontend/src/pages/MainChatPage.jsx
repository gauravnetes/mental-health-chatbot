import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PersonaAppContext } from '../context/PersonaAppContext';
import { AppContext } from '../context/AppContext';

import Sidebar from '../components/Sidebar/Sidebar';
import Main from '../components/Main/Main';

const PREMADE_PERSONAS = {
  mochi: { id: 'mochi', name: 'Mochi', avatar: 'path/to/mochi-avatar.png' },
  doraemon: { id: 'doraemon', name: 'Doraemon', avatar: 'path/to/doraemon-avatar.png' },
  shizuka: { id: 'shizuka', name: 'Shizuka', avatar: 'path/to/shizuka-avatar.png' },
  shinchan: { id: 'shinchan', name: 'Shinchan', avatar: 'path/to/shinchan-avatar.png' },
};

function ChatPage() {
  const { personaId } = useParams();
  const { customPersona } = useContext(PersonaAppContext);
  const { onSent } = useContext(AppContext);
  const navigate = useNavigate();

  const [currentPersona, setCurrentPersona] = useState(null);

  useEffect(() => {
    let personaData;
    if (personaId === 'custom') {
      personaData = customPersona;
    } else {
      personaData = PREMADE_PERSONAS[personaId];
    }
    
    if (!personaData) {
        navigate('/');
        return;
    }

    setCurrentPersona(personaData);
  }, [personaId, customPersona, navigate]);

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
      <Main onSent={handleSend} currentPersona={currentPersona}  />
    </div>
  );
}

export default ChatPage;
