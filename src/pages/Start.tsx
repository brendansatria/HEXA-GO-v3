import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Start = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <img src="/hexago_logo.png" alt="Hexa Go! Logo" className="mb-12 w-full max-w-2xl" />
        <div className="flex space-x-6">
          <Link to="/setup">
            <Button size="lg" className="px-8 py-6 text-lg bg-[#316283] hover:bg-[#27516d]">Create</Button>
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