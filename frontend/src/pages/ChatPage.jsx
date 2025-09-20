import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PersonaAppContext } from '../context/PersonaAppContext';
import { AppContext } from '../context/AppContext';

// Import your existing components
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
    
    // If no persona is found (e.g., direct navigation to chat page on refresh), redirect to start
    if (!personaData) {
        navigate('/');
        return;
    }

    setCurrentPersona(personaData);
  }, [personaId, customPersona, navigate]);

  // Create a new onSent function to pass down to the Main component
  const handleSend = (prompt) => {
    // Only send if a persona is fully loaded
    if (currentPersona) {
      onSent(prompt, currentPersona);
    }
  };

  // Prevent rendering until a persona is set, avoiding errors
  if (!currentPersona) {
    return <div className="min-h-screen bg-[#27272A] text-white flex items-center justify-center">Loading persona...</div>;
  }

  return (
    <div className="flex w-full h-screen bg-[#27272A]">
      <Sidebar />
      <Main onSent={handleSend} />
    </div>
  );
}

export default ChatPage;
