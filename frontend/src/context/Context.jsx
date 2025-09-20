import { useState, useEffect } from "react";
import { AppContext } from "./AppContext";
import PropTypes from "prop-types";

const ContextProvider = (props) => {
  // --- CHAT SESSION MANAGEMENT ---
  const [savedChats, setSavedChats] = useState(() => {
    const saved = localStorage.getItem('savedChats');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentChatId, setCurrentChatId] = useState(() => {
    return localStorage.getItem('currentChatId') || generateChatId();
  });

  const [isCurrentChatSaved, setIsCurrentChatSaved] = useState(false);

  // --- EXISTING STATE (keeping your structure) ---
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem(`chat_${currentChatId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [Input, setInput] = useState("");
  const [RecentPrompt, setRecentPrompt] = useState("");
  const [Loading, setLoading] = useState(false);
  const [ShowResult, setShowResult] = useState(chatHistory.length > 0);

  // --- HELPER FUNCTIONS ---
  function generateChatId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  function generateChatTitle(prompt) {
    if (!prompt) return "New Chat";
    return prompt.length > 40 ? prompt.slice(0, 40) + "..." : prompt;
  }

  // --- LOCALSTORAGE SAVING ---
  // Save current chat whenever chatHistory changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(chatHistory));
    }
    setShowResult(chatHistory.length > 0);
  }, [chatHistory, currentChatId]);

  // Save current chat ID
  useEffect(() => {
    localStorage.setItem('currentChatId', currentChatId);
  }, [currentChatId]);

  // Save saved chats list
  useEffect(() => {
    localStorage.setItem('savedChats', JSON.stringify(savedChats));
  }, [savedChats]);

  // --- CURRENT PERSONA STATE ---
  const [currentPersona, setCurrentPersona] = useState(() => {
    const saved = localStorage.getItem('currentPersona');
    return saved ? JSON.parse(saved) : null;
  });

  // Save current persona to localStorage
  useEffect(() => {
    if (currentPersona) {
      localStorage.setItem('currentPersona', JSON.stringify(currentPersona));
    }
  }, [currentPersona]);

  // --- NEW CHAT FUNCTION (FIXED) ---
  const newChat = () => {
    // Only save current chat if it has messages and hasn't been saved yet
    if (chatHistory.length > 0 && !isCurrentChatSaved) {
      const firstUserMessage = chatHistory.find(msg => msg.role === "user");
      const chatTitle = generateChatTitle(firstUserMessage?.parts[0] || "New Chat");
      
      const chatToSave = {
        id: currentChatId,
        title: chatTitle,
        messages: [...chatHistory],
        timestamp: Date.now()
      };

      setSavedChats(prev => {
        // Check if already exists (shouldn't happen, but just in case)
        const exists = prev.some(chat => chat.id === currentChatId);
        if (!exists) {
          return [chatToSave, ...prev].slice(0, 50); // Keep only last 50 chats
        }
        return prev;
      });
    }

    // Start fresh chat
    const newChatId = generateChatId();
    setCurrentChatId(newChatId);
    setChatHistory([]);
    setIsCurrentChatSaved(false);
    setLoading(false);
    setInput("");
    setRecentPrompt("");
  };

  // --- LOAD CHAT FROM HISTORY ---
  const loadChat = (chatId) => {
    // Save current chat before switching (if it has messages and isn't saved)
    if (chatHistory.length > 0 && !isCurrentChatSaved && currentChatId !== chatId) {
      const firstUserMessage = chatHistory.find(msg => msg.role === "user");
      const chatTitle = generateChatTitle(firstUserMessage?.parts[0] || "New Chat");
      
      const chatToSave = {
        id: currentChatId,
        title: chatTitle,
        messages: [...chatHistory],
        timestamp: Date.now()
      };

      setSavedChats(prev => {
        const exists = prev.some(chat => chat.id === currentChatId);
        if (!exists) {
          return [chatToSave, ...prev].slice(0, 50);
        }
        return prev;
      });
    }

    // Load the selected chat
    const selectedChat = savedChats.find(chat => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      setChatHistory(selectedChat.messages);
      setIsCurrentChatSaved(true);
      
      // Set recent prompt to last user message
      const lastUserMessage = selectedChat.messages
        .filter(msg => msg.role === "user")
        .pop();
      if (lastUserMessage) {
        setRecentPrompt(lastUserMessage.parts[0]);
      }
    }
  };

  // --- MODIFIED ONSENT FUNCTION ---
  const onSent = async (prompt, personaObject = null) => {
    // Use current persona if no personaObject provided
    const persona = personaObject || currentPersona;
    
    if (!persona) {
      console.error("No persona available for chat");
      setChatHistory((prev) => [
        ...prev,
        { role: "model", parts: ["Please select a persona first to start chatting."] },
      ]);
      return;
    }

    setLoading(true);
    const promptToSend = prompt !== undefined ? prompt : Input;
    setInput("");
    setRecentPrompt(promptToSend);

    const userMessage = { role: "user", parts: [promptToSend] };
    const newHistoryWithUserMessage = [...chatHistory, userMessage];
    const aiPlaceholder = { role: "model", parts: [""] };
    setChatHistory([...newHistoryWithUserMessage, aiPlaceholder]);

    // Mark current chat as unsaved since we're adding new content
    if (isCurrentChatSaved) {
      setIsCurrentChatSaved(false);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptToSend,
          persona: { id: persona.id },
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

  // --- UPDATE CURRENT CHAT IN SAVED CHATS (real-time updates) ---
  useEffect(() => {
    if (isCurrentChatSaved && chatHistory.length > 0) {
      setSavedChats(prev => {
        return prev.map(chat => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [...chatHistory],
              timestamp: Date.now()
            };
          }
          return chat;
        });
      });
    }
  }, [chatHistory, currentChatId, isCurrentChatSaved]);

  const contextValue = {
    // Existing props (maintaining compatibility)
    Input,
    setInput,
    RecentPrompt,
    setRecentPrompt: setRecentPrompt,
    Loading,
    onSent,
    newChat,
    chatHistory,
    ShowResult,
    
    // New props for improved sidebar
    savedChats,
    currentChatId,
    loadChat,
    isCurrentChatSaved,
    
    // Persona management
    currentPersona,
    setCurrentPersona,
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