
import { AlertTriangle, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

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

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-white hover:bg-white/20"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {mounted && (theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          ))}
        </Button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
