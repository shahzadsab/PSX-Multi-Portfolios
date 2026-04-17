import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Lock, Mail, UserPlus, LogIn } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    try {
      const res = await api.post(endpoint, { email, password });
      login(res.data.access_token);
      toast.success(isLogin ? "Welcome back!" : "Account created!");
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || "Authentication failed");
    }
  };

  const fillDemo = () => {
    setEmail('demo@sabsoft.com');
    setPassword('demo123');
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600">PSX Demo</h2>
        <p className="text-gray-500 mt-2">{isLogin ? 'Sign in to your portfolio' : 'Create a new account'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
          {isLogin ? <LogIn size={20}/> : <UserPlus size={20}/>}
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <div className="mt-6 space-y-4 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-blue-500 hover:underline"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
        
        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        <button 
          onClick={fillDemo}
          className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Use Demo Account (demo@sabsoft.com / demo123)
        </button>
      </div>
    </div>
  );
}