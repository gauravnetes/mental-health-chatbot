import { useContext, useEffect, useRef } from "react";
import "./Main.css";
import { AppContext } from "../../context/AppContext";
import MyLoader from "../Loader/Loader";
import { assets } from "../../assets/assets";

const Main = () => {
  // FIX 1: Destructured the correct, up-to-date state from context
  const {
    Input,
    setInput,
    Loading,
    onSent,
    chatHistory,
  } = useContext(AppContext);

  const handleKeyDown = (event) => {
    // Added a check for Input to prevent sending empty messages
    if (event.key === "Enter" && Input) {
      onSent();
    }
  };

  // FIX 2: Updated card click handler to call onSent directly
  const handleCardClick = (prompt) => {
    onSent(prompt);
  };

  // Auto-scrolling logic
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <>
      {/* FIX 3: Set the main background color and created a proper flex layout */}
      <div className="relative w-full h-screen flex flex-col bg-zinc-900 text-[#E4E4E7]">
        
        {/* Header section */}
        <header className="relative p-4 lg:px-5">
          <nav className="flex justify-between items-center max-w-4xl mx-auto">
            <a href="/">
              <h1 className="text-2xl font-semibold">
                MOCHI.Ai
              </h1>
            </a>
            <img
              className="w-[40px] h-[40px] rounded-full"
              src={assets.profile}
              alt="user"
            />
          </nav>
        </header>

        {/* Main content: switches between welcome and chat view */}
        <main className="flex-1 overflow-y-auto px-5 pb-4">
          
          {/* FIX 4: The main logic now correctly checks chatHistory.length */}
          {chatHistory.length === 0 ? (
            
            // WELCOME SCREEN
            <div className="greet-cards text-center flex flex-col justify-center items-center h-full">
              <div className="greet">
                <p id="logo" className="text-[7vh] lg:text-[13vh]">
                  <span>MOCHI.Ai</span>
                </p>
                <p className="text-[2.6vh] lg:text-[5vh] text-zinc-400">
                  How can I help you today?
                </p>
              </div>

              <div className="cards w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                {/* FIX 5: Updated cards with relevant prompts for Mochi AI */}
                <div
                  onClick={() => handleCardClick("I'm feeling anxious, what's a quick breathing exercise?")}
                  className="card bg-[#3F3F46] hover:bg-[#52525B] p-4 rounded-xl cursor-pointer transition-colors text-left min-h-[120px]"
                >
                  <p>Feeling anxious?</p>
                </div>
                <div
                  onClick={() => handleCardClick("How can I practice self-compassion?")}
                  className="card bg-[#3F3F46] hover:bg-[#52525B] p-4 rounded-xl cursor-pointer transition-colors text-left min-h-[120px]"
                >
                  <p>Practice self-compassion</p>
                </div>
                <div
                  onClick={() => handleCardClick("I feel unproductive. How can I get motivated?")}
                  className="card bg-[#3F3F46] hover:bg-[#52525B] p-4 rounded-xl cursor-pointer transition-colors text-left min-h-[120px]"
                >
                  <p>Feeling unproductive?</p>
                </div>
                <div
                  onClick={() => handleCardClick("What's a simple way to start journaling?")}
                  className="card bg-[#3F3F46] hover:bg-[#52525B] p-4 rounded-xl cursor-pointer transition-colors text-left min-h-[120px]"
                >
                  <p>Start journaling</p>
                </div>
              </div>
            </div>
          ) : (

            // CHAT VIEW
            <div className="result w-full max-w-4xl mx-auto flex flex-col gap-6">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className="message flex gap-4 items-start"
                >
                  <img
                    className="w-[40px] h-[40px] rounded-full"
                    src={
                      message.role === "user" ? assets.profile : assets.astra
                    }
                    alt={message.role}
                  />
                  <div className="flex-1">
                    <p className="font-bold capitalize">{message.role === 'user' ? 'You' : 'Mochi'}</p>
                    {/* FIX 6: Displaying content correctly from the new chatHistory structure */}
                    <p className="mt-1" style={{ whiteSpace: "pre-wrap" }}>
                      {message.parts[0].text}
                    </p>
                  </div>
                </div>
              ))}
              {Loading && <MyLoader />}
              <div ref={chatEndRef} />
            </div>
          )}
        </main>

        {/* Input bar */}
        <footer className="w-full max-w-4xl mx-auto p-4">
          <div className="prompt flex items-center gap-4 bg-[#3F3F46] w-full rounded-full p-2">
            <input
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              value={Input}
              className="flex-1 bg-transparent border-none outline-none px-4"
              type="text"
              placeholder="Share what's on your mind..."
            />
            {Input && (
              <button
                onClick={() => onSent()}
                className="p-2 rounded-full hover:bg-zinc-600 transition-colors"
              >
                <img src={assets.send} alt="send" className="w-6 h-6"/>
              </button>
            )}
          </div>
        </footer>
      </div>
    </>
  );
};

export default Main;

