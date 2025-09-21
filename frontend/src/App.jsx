import { Routes, Route } from 'react-router-dom';
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn,UserButton } from '@clerk/clerk-react';

import { PersonaProvider } from './context/PersonaProvider.jsx';

import MoodCheck from './pages/MoodCheck.jsx';
import PersonaHub from './pages/PersonaHub.jsx';
import CreatePersona from './pages/CreatePersona';
import ChatPage from './pages/ChatPage.jsx';


function App() {
  return (
    <PersonaProvider>
      <header>
        {/* You can add a persistent header here if you like */}
        {/* For signed-in users, the UserButton will appear */}
        <SignedIn>
          <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
            <UserButton afterSignOutUrl="/"/>
          </div>
        </SignedIn>
      </header>
      <Routes>
        <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
        
        {/* This is now a public landing page */}
        <Route path="/" element={<MoodCheck />} />

        {/* These routes remain protected */}
        <Route path="/personas" element={<ProtectedRoute><PersonaHub /></ProtectedRoute>} />
        <Route path="/create-persona" element={<ProtectedRoute><CreatePersona /></ProtectedRoute>} />
        <Route path="/chat/:personaId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      </Routes>
    </PersonaProvider>
  );
}

// A helper component to protect routes
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
};

export default App;