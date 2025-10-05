import React, { createContext, useContext, useRef, ReactNode } from 'react';
import ClickSound from '@/assets/attribute_click.mp3';

interface SoundContextType {
  playClickSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return (
    <SoundContext.Provider value={{ playClickSound }}>
      <audio ref={audioRef} src={ClickSound} preload="auto" />
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};