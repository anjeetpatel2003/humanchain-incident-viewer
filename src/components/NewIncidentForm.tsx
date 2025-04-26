
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
import { motion } from 'framer-motion';

interface NewIncidentFormProps {
  onSubmit: (incident: Omit<Incident, 'id'>) => void;
}

const NewIncidentForm = ({ onSubmit }: NewIncidentFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('Low');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newIncident = {
        title,
        description,
        severity,
        reported_at: new Date().toISOString(),
      };

      onSubmit(newIncident);
      
      // Reset form
      setTitle('');
      setDescription('');
      setSeverity('Low');
      
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
    <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">Report New Incident</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <Input
              placeholder="Incident Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <Textarea
              placeholder="Incident Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-400"
            />
          </div>
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
