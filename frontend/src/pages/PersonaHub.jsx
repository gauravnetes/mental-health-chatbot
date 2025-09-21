import { useContext } from 'react'; // 1. IMPORT REACT AND USECONTEXT
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
// 2. IMPORT THE PERSONA CONTEXT TO GET SAVED DATA
import { PersonaAppContext } from '../context/PersonaAppContext';

const PersonaCard = ({ to, name, description, isRecommended }) => (
  <Link to={to}>
    <div className={`p-6 bg-[#3F3F46] rounded-xl hover:bg-[#52525B] cursor-pointer transition-all duration-200 h-full ${isRecommended ? 'ring-2 ring-[#A5FD0B]' : 'ring-0'}`}>
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  </Link>
);

PersonaCard.propTypes = {
  to: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isRecommended: PropTypes.bool.isRequired,
};

const PersonaHub = () => {
  const location = useLocation();
  const mood = location.state?.mood;
  // 3. GET THE LIST OF SAVED CUSTOM PERSONAS FROM THE CONTEXT
  const { customPersonas } = useContext(PersonaAppContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#27272A] text-white p-6">
      <h1 className="text-4xl font-bold mb-4">Choose Your Companion</h1>
      <p className="text-zinc-400 text-lg mb-10">
        {mood && `Because you're feeling ${mood}, we recommend starting with Mochi.`}
      </p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* --- 4. DYNAMICALLY DISPLAY SAVED CUSTOM PERSONAS --- */}
        {customPersonas.map(persona => (
          <PersonaCard
            key={persona.id}
            to={`/chat/${persona.id}`}
            name={`✨ ${persona.name}`}
            description={persona.description}
            isRecommended={false}
          />
        ))}

        {/* --- Display Pre-made Personas --- */}
        <PersonaCard
          to="/chat/mochi"
          name="Mochi"
          description="A calm, patient listener to validate your feelings without judgment."
          isRecommended={mood === 'overwhelmed' || mood === 'sad'}
        />
        <PersonaCard
          to="/chat/shinchan"
          name="Shinchan"
          description="A playful and humorous friend to bring a smile to your face."
          isRecommended={mood === 'curious'}
        />
        <PersonaCard
          to="/chat/doraemon"
          name="Doraemon"
          description="A helpful guide to help you find solutions to your problems."
          isRecommended={mood === 'motivated'}
        />

        {/* --- Create New Persona Card --- */}
        <div className="md:col-span-2 lg:col-span-3">
          <PersonaCard
            to="/create-persona"
            name="✍️ Create Your Own"
            description="Design a custom AI companion tailored exactly to your needs."
            isRecommended={false}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonaHub;

