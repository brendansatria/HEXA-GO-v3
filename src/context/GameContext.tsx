import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Tile {
  id: number;
  isStartingTile: boolean;
  word: string;
  tag1: string;
  tag2: string;
  tag3: string;
}

interface GameContextType {
  tiles: Tile[];
  setTiles: (tiles: Tile[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);

  return (
    <GameContext.Provider value={{ tiles, setTiles }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};