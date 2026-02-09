import React, { useState } from 'react';
import { useApp } from '../App';
import { AppScreen } from '../types';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { setScreen, users } = useApp();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = () => {
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Missing email or password');
      return;
    }

    if (isLogin) {
      // CHECK GOOGLE SHEET: Look for matching email and password
      const userMatch = users.find(u => 
        u.email?.trim().toLowerCase() === email.trim().toLowerCase() && 
        u.password?.toString().trim() === password.trim()
      );

      if (userMatch) {
        // Success!
        setScreen(AppScreen.HOME);
      } else {
        // Fail
        setError('Authentication failed. User not found in database.');
      }
    } else {
      // For sign up in a demo, we just let them through
      setScreen(AppScreen.HOME);
    }
  };

  return (
    <div className="flex flex-col h-full p-8 bg-white overflow-y-auto">
      <div className="mt-16 text-center mb-12">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">VOLT<span className="text-green-500">SYNC</span></h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Cloud Integrated Security</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[11px] font-black mb-6 border border-red-100 flex items-center gap-3 animate-bounce">
          <span className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center">!</span>
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com" 
            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none font-bold"
          />
        </div>
      </div>

      <button 
        onClick={handleAuth}
        className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-sm mt-10 shadow-xl shadow-green-100 active:scale-95 transition-all uppercase tracking-widest"
      >
        {isLogin ? 'Verify & Login' : 'Create Account'}
      </button>

      <div className="mt-8 text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-green-500 transition-colors">
          {isLogin ? "Need an account?" : "Back to login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;