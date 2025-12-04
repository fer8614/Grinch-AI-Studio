import React, { useState, useEffect, useRef } from 'react';
import { GrinchPuppet } from './components/GrinchPuppet';
import { ScriptCard } from './components/ScriptCard';
import { AvatarState } from './types';

// The script provided in the prompt
const GRINCH_SCRIPT = `Te cuento, en nuestro Taller Online para tejer el Grinch

✅ Aprenderás a elegir los materiales correctos: tipos de hilos, lanas y las agujas de crochet ideales para que tu Grinch quede firme, definido y con acabado profesional.

✅ Dominarás los puntos y técnicas esenciales para tejer esta pieza paso a paso, aunque seas principiante. Te llevamos de la mano para que cada detalle quede perfecto.

✅ Seguirás un paso a paso 100% en video Full HD, donde podrás ver claramente cada movimiento y repetirlo las veces que necesites hasta terminar tu Grinch perfecto.

🤗 Y por supuesto, NUNCA ESTARÁS SOLA contarás con apoyo cercano en una comunidad VIP donde te acompañaremos y responderemos todas tus dudas con cariño y compromiso.

¡Y AÚN HAY MÁS! Por realizar la compra el día de HOY recibirás los siguientes 7  REGALOS completamente gratis 🎁👇🏻

 🎁 1: Tutorial de tapete navideño
 🎁 2: Guía de lectura de patrones escritos
 🎁 3: Guía para hacer tus amigurumis más grandes con el mismo patrón
 🎁  4: Patrón escrito del Grinch
 🎁  5: Patrones de virgencitas
 🎁  6: Guía de fotografía de producto
 🎁  7: Guía básica de empaque para emprendedoras
 
Con nuestro bono especial de Guía para hacer tus amigurumis más grandes con el mismo patrón lograrás crear un grinch gigante
`;

// Placeholder media if user doesn't upload one
const DEFAULT_VIDEO = "/grinch-video.mp4";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1606822369666-821763784158?q=80&w=1000&auto=format&fit=crop"; 

const App: React.FC = () => {
  const [avatarState, setAvatarState] = useState<AvatarState>(AvatarState.IDLE);
  const [mediaSrc, setMediaSrc] = useState<string>(DEFAULT_VIDEO);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('video');
  const mediaObjectUrlRef = useRef<string | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  const stopVideoPlayback = () => {
    if (videoElementRef.current) {
      videoElementRef.current.pause();
      videoElementRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    return () => {
      stopVideoPlayback();
      if (mediaObjectUrlRef.current) {
        URL.revokeObjectURL(mediaObjectUrlRef.current);
      }
    };
  }, []);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mediaObjectUrlRef.current) {
        URL.revokeObjectURL(mediaObjectUrlRef.current);
        mediaObjectUrlRef.current = null;
      }

      const objectUrl = URL.createObjectURL(file);
      mediaObjectUrlRef.current = objectUrl;

      if (file.type.startsWith('video/')) {
        setMediaType('video');
        setMediaSrc(objectUrl);
      } else {
        setMediaType('image');
        setMediaSrc(objectUrl);
        stopVideoPlayback();
      }
    }
    e.target.value = '';
  };

  const handleSpeak = async () => {
    stopVideoPlayback();

    try {
      if (mediaType !== 'video' || mediaSrc !== DEFAULT_VIDEO) {
        setMediaType('video');
        setMediaSrc(DEFAULT_VIDEO);
      }

      const videoEl = videoElementRef.current;
      if (!videoEl) {
        throw new Error('No se encontró el elemento de video');
      }

      const handleEnded = () => {
        setAvatarState(AvatarState.IDLE);
        videoEl.removeEventListener('ended', handleEnded);
      };

      videoEl.currentTime = 0;
      videoEl.muted = false; // Activar audio al reproducir
      videoEl.removeEventListener('ended', handleEnded);
      videoEl.addEventListener('ended', handleEnded);

      const playPromise = videoEl.play();
      setAvatarState(AvatarState.SPEAKING);

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((err) => {
          console.error('No se pudo reproducir el video automáticamente:', err);
          setAvatarState(AvatarState.ERROR);
          setTimeout(() => setAvatarState(AvatarState.IDLE), 3000);
        });
      }
    } catch (error) {
      console.error(error);
      setAvatarState(AvatarState.ERROR);
      stopVideoPlayback();
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
          <p className="text-yellow-300 text-2xl md:text-3xl font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">Curso de Amigurumi Navideño</p>
        </header>
        

        {/* Avatar Display */}
        <div className="w-full mb-8">
           <GrinchPuppet
             mediaSrc={mediaSrc}
             mediaType={mediaType}
             isSpeaking={avatarState === AvatarState.SPEAKING}
             videoRef={videoElementRef}
           />
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