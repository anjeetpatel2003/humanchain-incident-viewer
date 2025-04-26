
import { Severity, SortOrder } from '../types/incident';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Filter by:</span>
        <Select value={selectedSeverity} onValueChange={onSeverityChange}>
          <SelectTrigger className="w-[180px] bg-white/50 backdrop-blur-sm hover:bg-white transition-colors">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-[180px] bg-white/50 backdrop-blur-sm hover:bg-white transition-colors">
            <SelectValue placeholder="Sort by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export default Controls;
