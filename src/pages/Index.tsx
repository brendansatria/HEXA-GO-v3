import { MadeWithDyad } from "@/components/made-with-dyad";
import HexagonalBoard from "@/components/HexagonalBoard";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-950 p-4 overflow-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
          Hexagonal Honeycomb Board
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Hover over the hexagons to see them interact.
        </p>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <HexagonalBoard rows={10} cols={10} hexagonSize={30} />
      </div>
      <div className="w-full pt-4">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;