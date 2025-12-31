
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { User, UserRole } from './types';
import { MockDB } from './store';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CitizenDashboard from './pages/CitizenDashboard';
import CouncillorDashboard from './pages/CouncillorDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = MockDB.getAuth();
    if (savedUser) setUser(savedUser);
    setLoading(false);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    MockDB.setAuth(u);
  };

  const handleLogout = () => {
    setUser(null);
    MockDB.logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <AuthPage mode="login" onAuthSuccess={handleLogin} />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to="/dashboard" /> : <AuthPage mode="signup" onAuthSuccess={handleLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={
                !user ? <Navigate to="/login" /> : 
                user.role === UserRole.CITIZEN ? <CitizenDashboard user={user} /> : 
                <CouncillorDashboard user={user} />
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-slate-900 text-slate-400 py-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xl font-bold text-white">Fix-My-Ward</div>
            <p className="text-sm">© 2024 Fix-My-Ward. Empowering communities, one report at a time.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
