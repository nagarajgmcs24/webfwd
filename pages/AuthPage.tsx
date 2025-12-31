
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole, User, BENGALURU_WARDS } from '../types';
import { MockDB } from '../store';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onAuthSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ mode, onAuthSuccess }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    wardId: BENGALURU_WARDS[0].id
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (MockDB.findUserByEmail(formData.email)) {
        setError('Email already exists');
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        role: role,
        wardId: formData.wardId
      };
      MockDB.saveUser(newUser);
      onAuthSuccess(newUser);
      navigate('/dashboard');
    } else {
      const existingUser = MockDB.findUserByEmail(formData.email);
      if (existingUser) {
        onAuthSuccess(existingUser);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200 w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-slate-500 mt-2">
            {mode === 'signup' 
              ? 'Join your community platform today.' 
              : 'Sign in to manage your ward activities.'}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setRole(UserRole.CITIZEN)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === UserRole.CITIZEN ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Citizen
          </button>
          <button
            onClick={() => setRole(UserRole.COUNCILLOR)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === UserRole.COUNCILLOR ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Councillor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="name@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Bengaluru Ward</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.wardId}
                onChange={e => setFormData({ ...formData, wardId: e.target.value })}
              >
                {BENGALURU_WARDS.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 mt-4"
          >
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          {mode === 'login' ? (
            <p>Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Sign up</Link></p>
          ) : (
            <p>Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
