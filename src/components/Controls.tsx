
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
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (value: SortOrder) => void;
  showCharts: boolean;
  onToggleCharts: () => void;
}

const Controls = ({
  selectedSeverity,
  onSeverityChange,
  selectedCategory,
  onCategoryChange,
  sortOrder,
  onSortOrderChange,
  showCharts,
  onToggleCharts,
}: ControlsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-4 mb-6 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Severity:</span>
        <Select value={selectedSeverity} onValueChange={onSeverityChange}>
          <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors dark:text-gray-200">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors dark:text-gray-200">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Security Breach">Security Breach</SelectItem>
            <SelectItem value="Operational Error">Operational Error</SelectItem>
            <SelectItem value="Injury">Injury</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors dark:text-gray-200">
            <SelectValue placeholder="Sort by date" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="ml-auto">
        <Button 
          variant="ghost" 
          onClick={onToggleCharts} 
          className="bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          {showCharts ? 'Hide Charts' : 'Show Charts'}
        </Button>
      </div>
    </motion.div>
  );
};

// Import Button component at the top
import { Button } from './ui/button';

export default Controls;
