import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('demo@viralgen.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setToken = useAuthStore(state => state.setToken);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        const res = await api.post('/auth/login', formData);
        setToken(res.data.access_token);
        navigate('/');
      } else {
        await api.post('/auth/signup', { email, password });
        // After signup, login
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        const res = await api.post('/auth/login', formData);
        setToken(res.data.access_token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
            ViralGen AI
          </h1>
          <p className="text-textMuted">AI-Powered Marketing Content Generator</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={(e) => handleAuth(e, true)}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/25"
            >
              Sign In
            </button>
            <button 
              onClick={(e) => handleAuth(e, false)}
              disabled={loading}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
