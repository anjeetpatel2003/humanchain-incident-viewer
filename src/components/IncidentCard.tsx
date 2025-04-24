
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
      return 'bg-severity-low';
    case 'medium':
      return 'bg-severity-medium';
    case 'high':
      return 'bg-severity-high';
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
      <Card className="w-full p-4 hover:shadow-md transition-all duration-200 border-l-4 animate-fade-in relative overflow-hidden"
        style={{ borderLeftColor: incident.severity === 'High' ? '#ef4444' : incident.severity === 'Medium' ? '#f59e0b' : '#10b981' }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`${severityColor} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                {incident.severity}
              </span>
              <span className="text-sm text-gray-500">
                {format(new Date(incident.reported_at), 'MMM d, yyyy')}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-primary transition-colors">
              {incident.title}
            </h3>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-gray-600 text-sm"
                >
                  {incident.description}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-4 hover:bg-gray-100"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default IncidentCard;
