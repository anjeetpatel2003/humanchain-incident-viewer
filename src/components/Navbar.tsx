
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg py-4 px-6 fixed w-full top-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <AlertTriangle className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-white">HumanChain</h1>
            <p className="text-indigo-100 text-sm">AI Safety Incident Dashboard</p>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
