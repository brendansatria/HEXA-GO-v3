import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Start = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-7xl font-bold mb-12 text-gray-800 dark:text-gray-200 tracking-wider">
          HEXA GO!
        </h1>
        <div className="flex space-x-6">
          <Link to="/setup">
            <Button size="lg" className="px-8 py-6 text-lg">Create</Button>
          </Link>
          <Link to="/play">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">Instant Play</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;