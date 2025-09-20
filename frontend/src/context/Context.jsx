import { useState } from "react";
import { AppContext } from "./AppContext";
import PropTypes from 'prop-types';

const ContextProvider = (props) => {
  const [Input, setInput] = useState("");
  const [RecentPrompt, setRecentPrompt] = useState("");
  const [PrevPrompt, setPrevPrompt] = useState([]);
  const [ShowResult, setShowResult] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [ResultData, setResultData] = useState("");

  // You can add a state for the persona and change it from your UI later
  const [persona, setPersona] = useState("mochi"); // Default persona

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    // Reset previous results
    setResultData("");
    setLoading(true);
    setShowResult(true);

    // Determine the prompt to send
    const promptToSend = prompt !== undefined ? prompt : Input;
    setRecentPrompt(promptToSend);

    // Clear the input field
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptToSend,
          persona: persona, // Send the currently selected persona
        }),
      });

      if (!response.body) {
        throw new Error("Response body is null.");
      }

      // Prepare to read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      setLoading(false); // Stop the loader once the first chunk arrives

      // Read from the stream continuously
      while (true) {
        const { done, value } = await reader.read();
        if (done) break; // Stream is finished

        const chunk = decoder.decode(value);

        // Append the new chunk to ResultData in real-time
        setResultData((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Streaming failed:", error);
      setResultData("Oops! Something went wrong. Please try again.");
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
    ResultData,
    onSent,
    newChat,
    setPersona,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};


ContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};


export default ContextProvider;
