import { Routes, Route } from 'react-router-dom';
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn,UserButton } from '@clerk/clerk-react';

import { PersonaProvider } from './context/PersonaProvider.jsx';

import MoodCheck from './pages/MoodChecker.jsx';
import PersonaHub from './pages/PersonaDock.jsx';
import CreatePersona from './pages/CreatePersona';
import ChatPage from './pages/MainChatPage.jsx';


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
        {/* Public routes */}
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