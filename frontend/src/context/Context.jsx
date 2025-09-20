import { useState } from "react";
import { AppContext } from "./AppContext";
import PropTypes from "prop-types";

const ContextProvider = (props) => {
  const [Input, setInput] = useState("");
  const [RecentPrompt, setRecentPrompt] = useState("");
  const [PrevPrompt, setPrevPrompt] = useState([]);
  const [ShowResult, setShowResult] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [persona, setPersona] = useState("mochi");

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setChatHistory([]); // FIX: Clears the chat history to reset the screen
  };

  const onSent = async (prompt) => {
    setLoading(true);
    setShowResult(true);

    const promptToSend = prompt !== undefined ? prompt : Input;
    setInput("");
    setRecentPrompt(promptToSend);
    setPrevPrompt((prev) => [...prev, promptToSend]);

    // FIX: Create a new history variable with the user's message.
    // This prevents sending stale data to the backend.
    const userMessage = { role: "user", parts: [{ text: promptToSend }] };
    const newHistoryWithUserMessage = [...chatHistory, userMessage];

    // FIX: Perform a single, atomic state update for the UI.
    // This adds both the user's message and the AI's placeholder at once, preventing race conditions.
    const aiPlaceholder = { role: "model", parts: [{ text: "" }] };
    setChatHistory([...newHistoryWithUserMessage, aiPlaceholder]);

    try {
      const response = await fetch(
         "http://127.0.0.1:8000/api/chat/stream", 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: promptToSend,
            persona: persona,
            // FIX: Send the up-to-date history (without the AI placeholder) to the backend.
            history: newHistoryWithUserMessage.slice(-8), // Send last 8 turns for better context
          }),
        }
      );

      if (!response.body) throw new Error("Response body is null.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      setLoading(false); // Stop loader once stream starts

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        // FIX: A more robust way to update the last message in the stream.
        setChatHistory((prev) => {
          const lastMessage = prev[prev.length - 1];
          const updatedContent = lastMessage.parts[0].text + chunk;
          const updatedLastMessage = {
            ...lastMessage,
            parts: [{ text: updatedContent }],
          };
          return [...prev.slice(0, -1), updatedLastMessage];
        });
      }
    } catch (error) {
      console.error("Streaming failed:", error);
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        {
          role: "model",
          parts: [{ text: "Oops! Something went wrong. Please try again." }],
        },
      ]);
      setLoading(false);
    }
  };

  // FIX: Added 'chatHistory' to the context value so components can access it.
  const contextValue = {
    Input,
    setInput,
    RecentPrompt,
    setRecentPrompt,
    PrevPrompt,
    setPrevPrompt,
    ShowResult,
    Loading,
    onSent,
    newChat,
    setPersona,
    chatHistory, // This was the critical missing piece
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContextProvider;

