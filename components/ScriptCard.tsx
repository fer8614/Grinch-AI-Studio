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

       <div className="mt-6 flex flex-col items-center text-center">
         <h4 className="text-emerald-700 font-bold text-xl mb-4">Conoce nuestra plataforma de aprendizaje</h4>
         <img src="/grinch.jpeg" alt="Grinch Amigurumi" className="rounded-lg shadow-lg max-w-full h-auto" />
       </div>


       <div className="mt-6 pt-4 border-t border-gray-200 text-center">
         <p className="text-sm text-green-700 uppercase tracking-widest font-bold mb-2">Da click en el boton <span className="text-red-600">rojo</span> para ver el precio en tu pais</p>
         <a href="https://go.hotmart.com/B103206395F?ap=85aa" target="_blank" rel="noopener noreferrer" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transform transition hover:scale-105 shadow-xl animate-pulse">
           QUIERO EL GRINCH
         </a>
       </div>
       <div className="mt-6 flex flex-col items-center">
         <p className="text-green-600 font-bold text-lg mb-2">🔒Compra Segura. ⚡Descarga Inmediata.</p>
         <img src="/7-dias-de-garantia.png" alt="7 días de garantía" className="max-w-[150px] h-auto" />
       </div>
    </div>
  );
};
