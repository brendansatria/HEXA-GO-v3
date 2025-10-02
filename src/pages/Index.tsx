import { MadeWithDyad } from "@/components/made-with-dyad";
import HexagonalBoard from "@/components/HexagonalBoard";
import TileSidebar from "@/components/TileSidebar";
import Scoreboard from "@/components/Scoreboard";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Index = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen w-full flex flex-col bg-white dark:bg-gray-950">
        <div className="p-4 border-b dark:border-gray-800">
          <Scoreboard />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <TileSidebar />
          <main className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <HexagonalBoard rows={10} cols={10} hexagonSize={30} />
          </main>
        </div>
        <div className="w-full">
          <MadeWithDyad />
        </div>
      </div>
    </DndProvider>
  );
};

export default Index;