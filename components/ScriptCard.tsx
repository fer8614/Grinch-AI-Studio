import React from 'react';

interface ScriptCardProps {
  text: string;
}

export const ScriptCard: React.FC<ScriptCardProps> = ({ text }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border-l-8 border-red-600 max-w-2xl mx-auto mt-8 relative">
       {/* Speech Bubble Triangle */}
       <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[20px] border-b-white/90"></div>
       
       <h3 className="text-emerald-800 font-bold text-lg mb-2 flex items-center gap-2">
         <span className="text-2xl">🎄</span> El Grinch Dice:
       </h3>
       
       <p className="text-gray-800 whitespace-pre-line text-lg leading-relaxed font-medium">
         {text}
       </p>

       <div className="mt-6 pt-4 border-t border-gray-200 text-center">
         <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">Call to Action</p>
         <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transform transition hover:scale-105 shadow-xl animate-pulse">
           COMENTA "GRINCH"
         </button>
       </div>
    </div>
  );
};
