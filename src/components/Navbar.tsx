
import { AlertTriangle } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm py-4 px-6 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold text-gray-800">HumanChain</span>
        </div>
        <div className="text-sm text-gray-500">AI Safety Incident Dashboard</div>
      </div>
    </nav>
  );
};

export default Navbar;
