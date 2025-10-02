import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Setup = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold mb-6">Game Setup</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
          This is where you'll be able to customize your game settings.
        </p>
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Setup;