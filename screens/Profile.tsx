
import React from 'react';
import { useApp } from '../App';
import { AppScreen } from '../types';
import BottomNav from '../components/BottomNav';

const Profile: React.FC = () => {
  const { setScreen } = useApp();

  const menuItems = [
    { label: 'Profile', icon: '👤', screen: AppScreen.PROFILE },
    { label: 'My vehicle', icon: '🚗', screen: AppScreen.MY_VEHICLES },
    { label: 'My favorite', icon: '❤️', screen: AppScreen.HOME },
    { label: 'My booking', icon: '📅', screen: AppScreen.HOME },
    { label: 'Terms and conditions', icon: '📜', screen: AppScreen.HOME },
  ];

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="p-6 pt-12 flex flex-col items-center">
         <h1 className="text-xl font-bold mb-10">Profile</h1>
         
         <div className="relative mb-6">
            <div className="w-28 h-28 bg-gray-100 rounded-full border-4 border-green-50 overflow-hidden shadow-xl">
               <img src="https://picsum.photos/seed/user/300" className="w-full h-full object-cover" alt="user" />
            </div>
            <button className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full border-4 border-white text-white shadow-lg">
               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
            </button>
         </div>

         <h2 className="text-xl font-black text-gray-900">Ronald Richards</h2>
         <p className="text-gray-400 text-sm font-medium">ronaldrichards@gmail.com</p>

         <div className="w-full mt-10 space-y-2">
            {menuItems.map(item => (
               <button 
                 key={item.label}
                 onClick={() => setScreen(item.screen)}
                 className="w-full flex items-center justify-between p-5 bg-gray-50/50 hover:bg-green-50 rounded-3xl group transition-all"
               >
                  <div className="flex items-center gap-4">
                     <span className="text-xl">{item.icon}</span>
                     <span className="text-sm font-bold text-gray-700 group-hover:text-green-700">{item.label}</span>
                  </div>
                  <svg className="h-5 w-5 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
               </button>
            ))}
            
            <button 
              onClick={() => setScreen(AppScreen.AUTH)}
              className="w-full flex items-center justify-between p-5 text-red-500 hover:bg-red-50 rounded-3xl transition-all"
            >
               <div className="flex items-center gap-4">
                  <span className="text-xl">🚪</span>
                  <span className="text-sm font-bold">Log out</span>
               </div>
            </button>
         </div>
      </div>

      <BottomNav active="profile" />
    </div>
  );
};

export default Profile;
