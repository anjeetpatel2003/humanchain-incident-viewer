
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

interface NewIncidentFormProps {
  onSubmit: (incident: Omit<Incident, 'id'>) => void;
}

const NewIncidentForm = ({ onSubmit }: NewIncidentFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('Low');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newIncident = {
      title,
      description,
      severity,
      reported_at: new Date().toISOString(),
    };

    onSubmit(newIncident);
    setTitle('');
    setDescription('');
    setSeverity('Low');

    toast({
      title: "Success",
      description: "New incident reported successfully",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Report New Incident</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Incident Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Textarea
            placeholder="Incident Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[100px]"
          />
        </div>
        <div>
          <Select value={severity} onValueChange={(value) => setSeverity(value as Severity)}>
            <SelectTrigger>
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">
          Submit Incident
        </Button>
      </form>
    </Card>
  );
};

export default NewIncidentForm;
