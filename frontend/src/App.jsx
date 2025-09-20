import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PersonaProvider } from "./context/PersonaProvider.jsx";
import ContextProvider from "./context/Context.jsx";

// Import your new pages. Make sure you have created these files.
import MoodCheck from "./pages/MoodCheck";
import PersonaHub from "./pages/PersonaHub";
import CreatePersona from "./pages/CreatePersona";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    // The Context Providers now wrap the entire router,
    // making state available to all pages.
    <ContextProvider>
      <PersonaProvider>
        <Router>
          <Routes>
            {/* Each Route defines a page for a specific URL path */}
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
