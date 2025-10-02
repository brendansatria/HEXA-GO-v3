import { MadeWithDyad } from "@/components/made-with-dyad";
import HexagonalBoard from "@/components/HexagonalBoard";
import TileSidebar from "@/components/TileSidebar";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Index = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen w-full flex flex-col bg-white dark:bg-gray-950">
        <div className="text-center py-4 border-b dark:border-gray-800">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
            Hexagonal Honeycomb Board
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Drag tiles from the left and drop them onto the board.
          </p>
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