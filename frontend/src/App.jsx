import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PersonaProvider } from "./context/PersonaProvider.jsx";
import ContextProvider from "./context/Context.jsx";

import MoodCheck from "./pages/MoodChecker.jsx";
import PersonaHub from "./pages/PersonaDock.jsx";
import CreatePersona from "./pages/CreatePersona";
import ChatPage from "./pages/MainChatPage.jsx";

function App() {
  return (
    <ContextProvider>
      <PersonaProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MoodCheck />} />
            <Route path="/personas" element={<PersonaHub />} />
            <Route path="/create-persona" element={<CreatePersona />} />
            <Route path="/chat/:personaId" element={<ChatPage />} />
          </Routes>
        </Router>
      </PersonaProvider>
    </ContextProvider>
  );
}

export default App;
