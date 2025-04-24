
import { Severity, SortOrder } from '../types/incident';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ControlsProps {
  selectedSeverity: string;
  onSeverityChange: (value: string) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (value: SortOrder) => void;
}

const Controls = ({
  selectedSeverity,
  onSeverityChange,
  sortOrder,
  onSortOrderChange,
}: ControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Select value={selectedSeverity} onValueChange={onSeverityChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severities</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Controls;
