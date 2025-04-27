
import { useState } from 'react';
import { Incident, Severity } from '../types/incident';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useToast } from '../hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface NewIncidentFormProps {
  onSubmit: (incident: Omit<Incident, 'id'>) => void;
}

// Incident category types
type Category = 'Security Breach' | 'Operational Error' | 'Injury' | 'Other';

const NewIncidentForm = ({ onSubmit }: NewIncidentFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('Low');
  const [category, setCategory] = useState<Category>('Operational Error');
  const [location, setLocation] = useState('');
  const [affectedSystems, setAffectedSystems] = useState('');
  const [impactScope, setImpactScope] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Build additional details based on selected category
      let additionalDetails = {};
      
      if (category === 'Security Breach' && affectedSystems) {
        additionalDetails = { ...additionalDetails, affectedSystems };
      }
      
      if ((category === 'Operational Error' || category === 'Injury') && location) {
        additionalDetails = { ...additionalDetails, location };
      }
      
      if (impactScope) {
        additionalDetails = { ...additionalDetails, impactScope };
      }
      
      const newIncident = {
        title,
        description,
        severity,
        reported_at: new Date().toISOString(),
        category,
        ...additionalDetails,
      };

      onSubmit(newIncident);
      
      // Reset form
      setTitle('');
      setDescription('');
      setSeverity('Low');
      setCategory('Operational Error');
      setLocation('');
      setAffectedSystems('');
      setImpactScope('');
      
      toast({
        title: "Success",
        description: "New incident reported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit incident",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 shadow-lg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">Report New Incident</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
            <Input
              placeholder="Incident Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-400"
              aria-label="Incident title"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="Security Breach">Security Breach</SelectItem>
                <SelectItem value="Operational Error">Operational Error</SelectItem>
                <SelectItem value="Injury">Injury</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
            <Textarea
              placeholder="Incident Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-400"
              aria-label="Incident description"
            />
          </div>
          
          {/* Dynamic fields based on category */}
          <AnimatePresence>
            {(category === 'Security Breach') && (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Affected Systems</label>
                <Input
                  placeholder="e.g. Authentication, Database, API"
                  value={affectedSystems}
                  onChange={(e) => setAffectedSystems(e.target.value)}
                  className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  aria-label="Affected systems"
                />
              </motion.div>
            )}
            
            {(category === 'Operational Error' || category === 'Injury') && (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <Input
                  placeholder="Incident Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  aria-label="Incident location"
                />
              </motion.div>
            )}
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.2 }}
            >
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Impact Scope</label>
              <Input
                placeholder="e.g. Limited, Department-wide, Organization-wide"
                value={impactScope}
                onChange={(e) => setImpactScope(e.target.value)}
                className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                aria-label="Impact scope"
              />
            </motion.div>
          </AnimatePresence>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Severity</label>
            <Select value={severity} onValueChange={(value) => setSeverity(value as Severity)}>
              <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Incident'}
          </Button>
        </form>
      </motion.div>
    </Card>
  );
};

export default NewIncidentForm;
