import { useNavigate } from 'react-router-dom';

const MoodCheck = () => {
  const navigate = useNavigate();

  const handleMoodSelect = (mood) => {
    // Navigate to the persona hub and pass the selected mood in the state
    navigate('/personas', { state: { mood } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#27272A] text-white p-4">
      <h1 id="logo" className="text-5xl md:text-7xl font-bold mb-4">
        <span className="gradient-text">MOCHI.Ai</span>
      </h1>
      <p className="text-zinc-400 text-lg md:text-xl mb-12">
        A safe space for your thoughts.
      </p>

      <div className="w-full max-w-lg text-center">
        <h2 className="text-2xl font-semibold mb-6">How are you feeling right now?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleMoodSelect('overwhelmed')}
            className="p-4 bg-[#3F3F46] rounded-xl hover:bg-[#52525B] cursor-pointer transition-colors duration-200"
          >
            A Little Overwhelmed
          </button>
          <button
            onClick={() => handleMoodSelect('sad')}
            className="p-4 bg-[#3F3F46] rounded-xl hover:bg-[#52525B] cursor-pointer transition-colors duration-200"
          >
            Feeling Sad or Lonely
          </button>
          <button
            onClick={() => handleMoodSelect('curious')}
            className="p-4 bg-[#3F3F46] rounded-xl hover:bg-[#52525B] cursor-pointer transition-colors duration-200"
          >
            Just Curious
          </button>
          <button
            onClick={() => handleMoodSelect('motivated')}
            className="p-4 bg-[#3F3F46] rounded-xl hover:bg-[#52525B] cursor-pointer transition-colors duration-200"
          >
            Ready for a Pep Talk
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodCheck;
