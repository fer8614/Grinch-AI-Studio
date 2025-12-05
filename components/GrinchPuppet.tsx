import React, { useEffect } from 'react';

interface GrinchPuppetProps {
  mediaSrc: string;
  mediaType: 'image' | 'video';
  isSpeaking: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export const GrinchPuppet: React.FC<GrinchPuppetProps> = ({ mediaSrc, mediaType, isSpeaking, videoRef }) => {
  // Cargar el primer frame del video cuando se monta el componente
  useEffect(() => {
    if (mediaType === 'video' && videoRef?.current) {
      const video = videoRef.current;
      video.currentTime = 0.1;
    }
  }, [mediaSrc, mediaType, videoRef]);
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square group">
      {/* Glow Effect behind the Grinch */}
      <div className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-300 ${isSpeaking ? 'bg-red-500/30 opacity-100 animate-pulse' : 'bg-green-500/20 opacity-50'}`}></div>
      
      {/* The Avatar Image */}
      <div 
        className={`
          relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20
          transition-transform duration-100 ease-in-out origin-bottom
          ${isSpeaking ? 'animate-bounce-talk' : 'scale-100'}
        `}
        style={{
          animation: isSpeaking ? 'bounceTalk 0.4s infinite alternate' : 'none'
        }}
      >
        {/* Imagen de poster siempre visible cuando no está hablando */}
        <img 
          src="/grinch1.png" 
          alt="Grinch Avatar" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isSpeaking ? 'opacity-0' : 'opacity-100'}`}
        />
        {/* Video oculto hasta que se reproduce */}
        {mediaType === 'video' && (
          <video
            src={mediaSrc}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isSpeaking ? 'opacity-100' : 'opacity-0'}`}
            playsInline
            webkit-playsinline="true"
            preload="metadata"
            ref={videoRef}
            muted
          />
        )}
        
        {/* Mouth overlay simulation (simple opacity change to simulate movement if needed, 
            but the bounce usually looks funnier/better for puppets) */}
      </div>

      <style>{`
        @keyframes bounceTalk {
          0% { transform: scale(1) translateY(0); }
          100% { transform: scale(1.05) translateY(-10px); }
        }
      `}</style>
    </div>
  );
};
