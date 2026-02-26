import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useApp } from '../App';
import { AppScreen } from '../types';

const Auth: React.FC = () => {
  const { setScreen, users } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false); // Controls the OTP screen
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [userOtp, setUserOtp] = useState(''); // What the user types
  const [generatedOtp, setGeneratedOtp] = useState(''); // The real code
  const [loading, setLoading] = useState(false);

  // --- FUNCTION 1: SEND REAL EMAIL ---
  const handleStartSignup = async () => {
    if (!name || !email || !password) return alert("Please fill all fields");

    setLoading(true);
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString(); // Create 4-digit code
    setGeneratedOtp(newOtp);

    const templateParams = {
      to_name: name,
      to_email: email, // This sends it to the user's input email
      otp: newOtp,
    };

    try {
      await emailjs.send(
        'service_o7mvi8b', // Paste Service ID here
        'template_vm7dd1n', // Paste Template ID here
        templateParams,
        'J4ZWaktvcdEKd1xbm' // Paste Public Key here
      );
      setIsVerifying(true); // Switch to the OTP input screen
    } catch (error) {
      alert("Email failed to send. Check your EmailJS keys.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCTION 2: VERIFY & SAVE TO GOOGLE SHEET ---
  const handleVerifyAndSave = async () => {
    if (userOtp !== generatedOtp) return alert("Wrong code! Check your email again.");

    setLoading(true);
    try {
      // Your existing Google Script logic
      await fetch("https://script.google.com/macros/s/AKfycbx0X0lQubkUsql-E-v5sim-RdRzGcr7OOakfsPgA5_0ihbIM-25h33OevtDNaghUDDTVw/exec", {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone }),
      });
      alert("Verified! Account Created.");
      setScreen(AppScreen.HOME);
    } catch (e) {
      alert("Verified, but failed to save to Google Sheets.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-8 bg-white overflow-y-auto">
      <div className="mt-10 text-center mb-8">
        <h1 className="text-3xl font-black italic">VOLT<span className="text-green-500">QUEST</span></h1>
      </div>

      {!isVerifying ? (
        /* --- SIGNUP / LOGIN FORM --- */
        <div className="space-y-4">
          {!isLogin && (
            <input type="text" placeholder="Full Name" className="w-full p-4 bg-gray-50 border rounded-2xl" onChange={(e) => setName(e.target.value)} />
          )}
          <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 border rounded-2xl" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 border rounded-2xl" onChange={(e) => setPassword(e.target.value)} />
          
          <button 
            onClick={isLogin ? () => setScreen(AppScreen.HOME) : handleStartSignup}
            className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold uppercase"
          >
            {loading ? "Processing..." : (isLogin ? "Login" : "Register & Get Code")}
          </button>
          
          <button onClick={() => setIsLogin(!isLogin)} className="w-full text-gray-400 text-xs font-bold uppercase">
            {isLogin ? "Create Account" : "Back to Login"}
          </button>
        </div>
      ) : (
        /* --- OTP VERIFICATION SCREEN --- */
        <div className="space-y-6 text-center animate-pulse">
          <p className="text-sm text-gray-500">A code was sent to <b>{email}</b></p>
          <input 
            type="text" 
            placeholder="0000" 
            maxLength={4} 
            className="w-full p-4 bg-gray-100 border-2 border-green-500 rounded-2xl text-center text-3xl font-black tracking-widest"
            onChange={(e) => setUserOtp(e.target.value)}
          />
          <button onClick={handleVerifyAndSave} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase">
            {loading ? "Checking..." : "Verify & Start"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;