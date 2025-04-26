
import { useState } from 'react';
import { Incident } from '../types/incident';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface IncidentCardProps {
  incident: Incident;
}

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'low':
      return 'bg-emerald-500';
    case 'medium':
      return 'bg-amber-500';
    case 'high':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const IncidentCard = ({ incident }: IncidentCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const severityColor = getSeverityColor(incident.severity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-br from-white/5 to-white/10 rounded-full blur-2xl" />
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <span className={`${severityColor} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                  {incident.severity}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {format(new Date(incident.reported_at), 'MMM d, yyyy')}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {incident.title}
              </h3>
              
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
                  >
                    {incident.description}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default IncidentCard;
