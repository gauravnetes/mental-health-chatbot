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
    setChatHistory([]);
  };

  const onSent = async (prompt) => {
    setLoading(true);
    setShowResult(true);

    const promptToSend = prompt !== undefined ? prompt : Input;
    setInput("");
    setRecentPrompt(promptToSend);
    setPrevPrompt((prev) => [...prev, promptToSend]);

    // FIX 1: Changed the data structure of 'parts' to be an array of strings
    const userMessage = { role: "user", parts: [promptToSend] };
    const newHistoryWithUserMessage = [...chatHistory, userMessage];

    const aiPlaceholder = { role: "model", parts: [""] };
    setChatHistory([...newHistoryWithUserMessage, aiPlaceholder]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/chat/stream", // Using localhost for local testing
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: promptToSend,
            persona: { id: persona },
            chatHistory: newHistoryWithUserMessage.slice(-8),
          }),
        }
      );

      // This handles the 422 error specifically
      if (response.status === 422) {
        const errorData = await response.json();
        console.error("Validation Error:", errorData);
        throw new Error("The data sent to the server was invalid.");
      }
      if (!response.body) throw new Error("Response body is null.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      setLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        // FIX 2: Updated the streaming logic to work with an array of strings
        setChatHistory((prev) => {
          const lastMessage = prev[prev.length - 1];
          const updatedContent = lastMessage.parts[0] + chunk;
          const updatedLastMessage = {
            ...lastMessage,
            parts: [updatedContent],
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
          // FIX 3: Updated the error message structure
          parts: ["Oops! Something went wrong. Please try again."],
        },
      ]);
      setLoading(false);
    }
  };

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
    chatHistory,
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

