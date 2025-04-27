
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import IncidentCard from '../components/IncidentCard';
import Controls from '../components/Controls';
import IncidentCharts from '../components/IncidentCharts';
import NewIncidentForm from '../components/NewIncidentForm';
import { Incident, SortOrder } from '../types/incident';
import { mockIncidents } from '../data/mockIncidents';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks/use-mobile';
import { Button } from '../components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showCharts, setShowCharts] = useState(true);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);

  useEffect(() => {
    // Load incidents from localStorage if available, otherwise use mockIncidents
    const savedIncidents = localStorage.getItem('incidents');
    if (savedIncidents) {
      try {
        setIncidents(JSON.parse(savedIncidents));
      } catch (error) {
        console.error('Failed to parse saved incidents:', error);
        setIncidents(mockIncidents);
      }
    } else {
      setIncidents(mockIncidents);
    }

    // Check if first visit to show guide
    const guideSeen = localStorage.getItem('guideSeen');
    if (!guideSeen) {
      setIsGuideVisible(true);
      localStorage.setItem('guideSeen', 'true');
    }
  }, []);

  // Save incidents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('incidents', JSON.stringify(incidents));
  }, [incidents]);

  // Guide content for onboarding
  const guideSteps = [
    {
      title: "Welcome to HumanChain Dashboard",
      content: "This is where you can track and manage AI safety incidents. Let's take a quick tour!",
    },
    {
      title: "Filter Incidents",
      content: "Use these controls to filter incidents by severity, category, and sort them by date.",
    },
    {
      title: "View Charts",
      content: "Toggle charts to see visual breakdowns of incidents by severity and over time.",
    },
    {
      title: "Report Incidents",
      content: "Use this form to report new AI safety incidents. Different categories will show different fields.",
    },
  ];

  const filteredAndSortedIncidents = incidents
    .filter((incident) =>
      selectedSeverity === 'all' ? true : incident.severity === selectedSeverity
    )
    .filter((incident) =>
      selectedCategory === 'all' ? true : incident.category === selectedCategory
    )
    .sort((a, b) => {
      const dateA = new Date(a.reported_at).getTime();
      const dateB = new Date(b.reported_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const handleNewIncident = (newIncident: Omit<Incident, 'id'>) => {
    const incident: Incident = {
      ...newIncident,
      id: Math.max(...incidents.map((i) => i.id), 0) + 1,
    };
    
    setIncidents([incident, ...incidents]);
    
    // Hide mobile form after submission on mobile
    if (isMobile) {
      setShowMobileForm(false);
    }
    
    toast({
      title: "Incident Reported",
      description: "Your incident has been successfully recorded.",
    });
  };

  const handleGuideNext = () => {
    if (currentGuideStep < guideSteps.length - 1) {
      setCurrentGuideStep(currentGuideStep + 1);
    } else {
      setIsGuideVisible(false);
    }
  };

  const handleGuideClose = () => {
    setIsGuideVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Onboarding guide overlay */}
      <AnimatePresence>
        {isGuideVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <button 
                onClick={handleGuideClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
              <h2 className="text-xl font-semibold mb-2 dark:text-white">{guideSteps[currentGuideStep].title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{guideSteps[currentGuideStep].content}</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {guideSteps.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full ${
                        idx === currentGuideStep ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <Button onClick={handleGuideNext}>
                  {currentGuideStep < guideSteps.length - 1 ? "Next" : "Got it!"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Safety Incidents
              </h1>
              
              {/* Mobile form toggle button */}
              {isMobile && (
                <Button 
                  onClick={() => setShowMobileForm(!showMobileForm)}
                  size="sm" 
                  className="lg:hidden"
                >
                  {showMobileForm ? (
                    <><X className="mr-1 h-4 w-4" /> Hide Form</>
                  ) : (
                    <><PlusCircle className="mr-1 h-4 w-4" /> New Incident</>
                  )}
                </Button>
              )}
            </div>
            
            <Controls
              selectedSeverity={selectedSeverity}
              onSeverityChange={setSelectedSeverity}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              showCharts={showCharts}
              onToggleCharts={() => setShowCharts(!showCharts)}
            />
            
            <AnimatePresence>
              {showCharts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <IncidentCharts incidents={incidents} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile form */}
            <AnimatePresence>
              {isMobile && showMobileForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <NewIncidentForm onSubmit={handleNewIncident} />
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {filteredAndSortedIncidents.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">No incidents found matching the current filters.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredAndSortedIncidents.map((incident) => (
                    <IncidentCard key={incident.id} incident={incident} />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          </div>
          
          {/* Desktop form */}
          {!isMobile && (
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-24">
                <NewIncidentForm onSubmit={handleNewIncident} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
