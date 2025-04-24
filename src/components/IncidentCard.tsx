
import { useState } from 'react';
import { Incident } from '../types/incident';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { format } from 'date-fns';

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
    <Card className="w-full p-4 hover:shadow-md transition-shadow duration-200 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`${severityColor} text-white text-xs px-2 py-1 rounded-full`}>
              {incident.severity}
            </span>
            <span className="text-sm text-gray-500">
              {format(new Date(incident.reported_at), 'MMM d, yyyy')}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{incident.title}</h3>
          <div className={`text-gray-600 text-sm ${!isExpanded ? 'line-clamp-2' : ''}`}>
            {incident.description}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
};

export default IncidentCard;
