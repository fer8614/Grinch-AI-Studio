import React, { useState, useEffect, useRef } from 'react';
import { generateGrinchSpeech } from './services/geminiService';
import { GrinchPuppet } from './components/GrinchPuppet';
import { ScriptCard } from './components/ScriptCard';
import { AvatarState } from './types';

// The script provided in the prompt
const GRINCH_SCRIPT = `¡ALTO AHÍ, HUMANO TEJEDOR! 
¿Me ves? ¿Crees que aparecí así de perfecto, gruñón y esponjocito por arte de magia?
¡JA! Ni que fuera Santa Claus. 

A mí me tejieron siguiendo un curso tan fácil que hasta yo podría hacerlo… si no me diera pereza, claro. 
Tiene videos paso a paso, acompañamiento, y te explican todo tan clarito que hasta tu suegra lo entendería. 

¿Quieres hacer tu propio Grinch?
Pues deja de mirar y ponte a tejer, que ya casi es Navidad y tú sigues ‘pensándolo’.
Comenta GRINCH y te mando el curso antes de que me enoje… más. 

Y recuerda: si no lo compras tú… igual lo va a comprar tu vecina.`;

// Placeholder image if user doesn't upload one, using a generic crochet toy or similar
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1606822369666-821763784158?q=80&w=1000&auto=format&fit=crop"; 

const App: React.FC = () => {
  const [avatarState, setAvatarState] = useState<AvatarState>(AvatarState.IDLE);
  const [imageSrc, setImageSrc] = useState<string>(DEFAULT_IMAGE);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize Audio Context on user interaction to comply with browser policies
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImageSrc(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeak = async () => {
    initAudio();
    
    // Stop any current audio
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }

    try {
      setAvatarState(AvatarState.LOADING);
      
      const audioBuffer = await generateGrinchSpeech(GRINCH_SCRIPT);
      
      if (audioContextRef.current) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        
        source.onended = () => {
          setAvatarState(AvatarState.IDLE);
        };

        audioSourceRef.current = source;
        source.start();
        setAvatarState(AvatarState.SPEAKING);
      }
    } catch (error) {
      console.error(error);
      setAvatarState(AvatarState.ERROR);
      setTimeout(() => setAvatarState(AvatarState.IDLE), 3000);
    }
  };

  return (
    <div className="min-h-screen grinch-gradient text-white overflow-x-hidden pb-12">
      <div className="snow"></div>
      
      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-2">
            El Grinch Tejedor
          </h1>
          <p className="text-green-200 text-lg">Curso de Amigurumi Navideño</p>
        </header>

        {/* Control Panel / Upload */}
        <div className="mb-8 w-full max-w-md bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col items-center gap-4 border border-white/20">
            <label className="flex flex-col items-center cursor-pointer group">
                <span className="text-sm font-semibold mb-2 group-hover:text-green-300 transition-colors">📸 Sube tu foto del Grinch</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className="px-4 py-2 bg-white/20 rounded-full text-xs hover:bg-white/30 transition">
                    Seleccionar Archivo
                </div>
            </label>
        </div>

        {/* Avatar Display */}
        <div className="w-full mb-8">
           <GrinchPuppet imageSrc={imageSrc} isSpeaking={avatarState === AvatarState.SPEAKING} />
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleSpeak}
            disabled={avatarState === AvatarState.LOADING || avatarState === AvatarState.SPEAKING}
            className={`
              relative px-8 py-4 rounded-full font-bold text-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95
              ${avatarState === AvatarState.LOADING 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white ring-4 ring-white/30'}
            `}
          >
            {avatarState === AvatarState.LOADING ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando voz...
              </span>
            ) : avatarState === AvatarState.SPEAKING ? (
              "🔊 Escuchando..."
            ) : (
              "📢 ¡Haz hablar al Grinch!"
            )}
          </button>
        </div>

        {/* Error Message */}
        {avatarState === AvatarState.ERROR && (
          <div className="mb-6 p-4 bg-red-500/80 rounded-lg text-white font-bold animate-bounce">
            ¡Rayos! El Grinch está de mal humor y no quiere hablar. Revisa tu API Key.
          </div>
        )}

        {/* Script Display */}
        <ScriptCard text={GRINCH_SCRIPT} />

      </main>
    </div>
  );
};

export default App;