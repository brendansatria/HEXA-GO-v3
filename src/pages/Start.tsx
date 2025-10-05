import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Start = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <img src="/hexago_logo.png" alt="Hexa Go! Logo" className="mb-12 w-full max-w-2xl" />
        <div className="flex space-x-6">
          <Link to="/setup">
            <Button size="lg" className="px-8 py-6 text-lg bg-[#3C435D] hover:bg-[#32374a]">Create</Button>
          </Link>
          <Link to="/play">
            <Button size="lg" className="px-8 py-6 text-lg bg-[#E4DACE] hover:bg-[#D3C9B9] text-white">Instant Play</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;