import { useState } from "react";
import { AppContext } from "./AppContext";
import PropTypes from "prop-types";

const ContextProvider = (props) => {
  const [Input, setInput] = useState("");
  const [RecentPrompt, setRecentPrompt] = useState("");
  const [PrevPrompt, setPrevPrompt] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  
  const newChat = () => {
    setLoading(false);
    setChatHistory([]);
  };

  // onSent is now upgraded to accept a persona object
  const onSent = async (prompt, personaObject) => {
    if (!personaObject) {
      console.error("Persona object is missing!");
      return;
    }

    setLoading(true);
    const promptToSend = prompt !== undefined ? prompt : Input;
    setInput("");
    setRecentPrompt(promptToSend);
    setPrevPrompt((prev) => [...prev, promptToSend]);

    const userMessage = { role: "user", parts: [promptToSend] };
    const newHistoryWithUserMessage = [...chatHistory, userMessage];
    const aiPlaceholder = { role: "model", parts: [""] };
    setChatHistory([...newHistoryWithUserMessage, aiPlaceholder]);

    // Build the correct persona payload based on the developer guide
    let personaPayload;
    if (personaObject.id === 'custom') {
      personaPayload = personaObject;
    } else {
      personaPayload = { id: personaObject.id };
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptToSend,
          persona: personaPayload,
          chatHistory: newHistoryWithUserMessage.slice(-8),
        }),
      });

      if (!response.body) throw new Error("Response body is null.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      setLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setChatHistory((prev) => {
          const lastMessage = prev[prev.length - 1];
          const updatedContent = lastMessage.parts[0] + chunk;
          const updatedLastMessage = { ...lastMessage, parts: [updatedContent] };
          return [...prev.slice(0, -1), updatedLastMessage];
        });
      }
    } catch (error) {
      console.error("Streaming failed:", error);
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { role: "model", parts: ["Oops! Something went wrong."] },
      ]);
      setLoading(false);
    }
  };

  const contextValue = {
    Input,
    setInput,
    RecentPrompt,
    PrevPrompt,
    Loading,
    onSent,
    newChat,
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