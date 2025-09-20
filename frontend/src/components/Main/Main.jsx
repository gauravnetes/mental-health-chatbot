import { useContext, useEffect, useRef } from "react";
import "./Main.css";
import { AppContext } from "../../context/AppContext";
import MyLoader from "../Loader/Loader";
import { assets } from "../../assets/assets";

const Main = () => {
  const {
    Input,
    setInput,
    onSent,
    chatHistory,
    Loading,
  } = useContext(AppContext);

  const chatEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);


  const handleKeyDown = (event) => {
    if (event.key === "Enter" && Input) {
      onSent();
    }
  };

  // This function will be used for the welcome cards
  const handleCardClick = (promptText) => {
    onSent(promptText);
  };

  return (
    <main className="flex-1 h-full flex flex-col bg-[#27272A] text-[#E4E4E7]">
      <nav className="flex justify-between items-center p-4">
        <h1 id="logo" className="text-2xl font-semibold">
          <span className="gradient-text">MOCHI.Ai</span>
        </h1>
        <img
          className="w-10 h-10 rounded-full"
          src={assets.profile}
          alt="user"
        />
      </nav>

      <div className="flex-1 w-full max-w-4xl mx-auto overflow-y-auto p-4 custom-scrollbar">
        {chatHistory.length === 0 ? (
          <>
            {/* Welcome Screen */}
            <div className="text-center my-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="gradient-text">Hello, Friend.</span>
              </h2>
              <p className="text-zinc-400 text-lg">
                What's on your mind today?
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div onClick={() => handleCardClick("I'm feeling a little overwhelmed today.")} className="p-4 bg-[#3F3F46] rounded-xl hover:bg-[#52525B] cursor-pointer">
                <p>I'm feeling a little overwhelmed today.</p>
              </div>
              <div onClick={() => handleCardClick("Can we talk through a problem I'm facing?")} className="p-4 bg-[#3F3F46] rounded-xl hover:bg-[#52525B] cursor-pointer">
                <p>Can we talk through a problem I'm facing?</p>
              </div>
              <div onClick={() => handleCardClick("Tell me something to feel grateful for.")} className="p-4 bg-[#3F3F46] rounded-xl hover:bg-[#52525B] cursor-pointer">
                <p>Tell me something to feel grateful for.</p>
              </div>
              <div onClick={() => handleCardClick("Help me practice a simple breathing exercise.")} className="p-4 bg-[#3F3F46] rounded-xl hover:bg-[#52525B] cursor-pointer">
                <p>Help me practice a simple breathing exercise.</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Chat History */}
            <div className="flex flex-col gap-4">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className="message flex gap-4 items-start"
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src={message.role === "user" ? assets.profile : assets.astra}
                    alt={message.role}
                  />
                  <div className="flex flex-col">
                    <p className="font-bold text-sm mb-1">
                      {message.role === "user" ? "You" : "Mochi"}
                    </p>
                    {/* FIX: Correctly access the text from message.parts[0] */}
                    <p className="text-zinc-200" style={{ whiteSpace: "pre-wrap" }}>
                      {message.parts[0]}
                    </p>
                  </div>
                </div>
              ))}
              {Loading && (
                 <div className="message flex gap-4 items-start">
                    <img className="w-8 h-8 rounded-full" src={assets.astra} alt="Mochi" />
                    <MyLoader />
                 </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </>
        )}
      </div>

      <footer className="w-full max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-4 bg-[#3F3F46] rounded-full p-3">
          <input
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            value={Input}
            className="flex-1 bg-transparent border-none outline-none text-zinc-200"
            type="text"
            placeholder="Share what's on your mind..."
          />
          {Input && (
            <button onClick={() => onSent()}>
              <img className="w-6 h-6" src={assets.send} alt="Send" />
            </button>
          )}
        </div>
      </footer>
    </main>
  );
};

export default Main;

