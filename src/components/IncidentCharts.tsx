
import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { motion } from 'framer-motion';
import { 
  Bar, 
  Pie, 
  Line,
  Cell, 
  XAxis, 
  YAxis, 
  Legend,
  Tooltip, 
  PieChart, 
  BarChart, 
  LineChart,
  CartesianGrid, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { format, parseISO, subMonths, startOfMonth, differenceInMonths } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ChevronRight, Info } from 'lucide-react';
import { Incident, Severity, ChartView, ChartType } from '../types/incident';
import { Button } from './ui/button';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface IncidentChartsProps {
  incidents: Incident[];
}

const IncidentCharts = ({ incidents }: IncidentChartsProps) => {
  const [chartView, setChartView] = useState<ChartView>('monthly');
  const [selectedChart, setSelectedChart] = useState<ChartType>('severity');
  
  // Colors for different themes
  const colors = {
    severity: {
      Low: { light: '#10b981', dark: '#4ade80' },
      Medium: { light: '#f59e0b', dark: '#fbbf24' },
      High: { light: '#ef4444', dark: '#f87171' }
    },
    categories: {
      'Security Breach': { light: '#6366f1', dark: '#818cf8' },
      'Operational Error': { light: '#f97316', dark: '#fb923c' },
      'Injury': { light: '#dc2626', dark: '#ef4444' },
      'Other': { light: '#8b5cf6', dark: '#a78bfa' }
    },
    status: {
      'Open': { light: '#f59e0b', dark: '#fbbf24' },
      'Resolved': { light: '#10b981', dark: '#4ade80' },
      'In Progress': { light: '#6366f1', dark: '#818cf8' }
    }
  };
  
  // Severity distribution data
  const severityData = useMemo(() => {
    const counts = {
      Low: 0,
      Medium: 0,
      High: 0,
    };
    
    incidents.forEach(incident => {
      counts[incident.severity]++;
    });
    
    return [
      { name: 'Low', value: counts.Low, color: colors.severity.Low },
      { name: 'Medium', value: counts.Medium, color: colors.severity.Medium },
      { name: 'High', value: counts.High, color: colors.severity.High },
    ];
  }, [incidents]);
  
  // Category distribution data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {
      'Security Breach': 0,
      'Operational Error': 0,
      'Injury': 0,
      'Other': 0
    };
    
    incidents.forEach(incident => {
      const category = incident.category || 'Other';
      counts[category]++;
    });
    
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colors.categories[name as keyof typeof colors.categories]
    }));
  }, [incidents]);
  
  // Status distribution data
  const statusData = useMemo(() => {
    const counts = {
      'Open': 0,
      'Resolved': 0,
      'In Progress': 0
    };
    
    incidents.forEach(incident => {
      const status = incident.status || 'Open';
      counts[status]++;
    });
    
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colors.status[name as keyof typeof colors.status]
    }));
  }, [incidents]);
  
  // Time-based data
  const timeData = useMemo(() => {
    if (!incidents.length) return [];
    
    // Find date range
    const dates = incidents.map(i => new Date(i.reported_at));
    const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const today = new Date();
    
    // Create time buckets based on selected view
    let timeFormat: string;
    let timeBuckets: Date[] = [];
    
    if (chartView === 'monthly') {
      // Last 12 months
      timeFormat = 'MMM yyyy';
      for (let i = 0; i <= 12; i++) {
        timeBuckets.push(startOfMonth(subMonths(today, i)));
      }
      timeBuckets.reverse();
    } else if (chartView === 'weekly') {
      // Last 10 weeks
      timeFormat = "'Week' w";
      for (let i = 0; i <= 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        timeBuckets.push(date);
      }
      timeBuckets.reverse();
    } else { // yearly
      // Available years
      timeFormat = 'yyyy';
      const oldestYear = oldestDate.getFullYear();
      const currentYear = today.getFullYear();
      for (let year = oldestYear; year <= currentYear; year++) {
        timeBuckets.push(new Date(year, 0, 1));
      }
    }
    
    // Create buckets for each category
    const severityBuckets: Record<Severity, Record<string, number>> = {
      Low: {},
      Medium: {},
      High: {}
    };
    
    // Initialize all time buckets to 0
    timeBuckets.forEach(date => {
      const key = format(date, timeFormat);
      severityBuckets.Low[key] = 0;
      severityBuckets.Medium[key] = 0;
      severityBuckets.High[key] = 0;
    });
    
    // Count incidents into buckets
    incidents.forEach(incident => {
      const date = new Date(incident.reported_at);
      const key = format(date, timeFormat);
      
      if (severityBuckets[incident.severity][key] !== undefined) {
        severityBuckets[incident.severity][key]++;
      }
    });
    
    // Convert to chart data
    return timeBuckets.map(date => {
      const key = format(date, timeFormat);
      return {
        name: key,
        Low: severityBuckets.Low[key] || 0,
        Medium: severityBuckets.Medium[key] || 0,
        High: severityBuckets.High[key] || 0,
        total: (severityBuckets.Low[key] || 0) + 
               (severityBuckets.Medium[key] || 0) + 
               (severityBuckets.High[key] || 0)
      };
    });
  }, [incidents, chartView]);
  
  // Calculate averages for reference lines
  const averageIncidents = useMemo(() => {
    if (!timeData.length) return 0;
    const sum = timeData.reduce((acc, day) => acc + day.total, 0);
    return Math.round(sum / timeData.length * 10) / 10;
  }, [timeData]);

  // Find max value for highlighting
  const maxIncidentsDay = useMemo(() => {
    if (!timeData.length) return null;
    return timeData.reduce((max, day) => 
      day.total > max.total ? day : max, 
      { name: '', total: 0 }
    );
  }, [timeData]);

  // Get theme-aware colors
  const getThemeColor = (colorObj: { light: string, dark: string }) => {
    return colorObj.light; // Default to light theme color
  };

  // Custom tooltip formatting
  const CustomTooltipFormatter = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="p-3 bg-white/90 dark:bg-gray-800/90 shadow-lg border border-gray-200 dark:border-gray-700 rounded-md backdrop-blur-sm">
        <p className="font-medium text-sm mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center">
              <div 
                className="w-3 h-3 mr-2 rounded-sm" 
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {entry.name}: <span className="font-medium">{entry.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
    >
      {/* Chart Type Selection */}
      <div className="lg:col-span-2">
        <Tabs 
          defaultValue="severity" 
          value={selectedChart}
          onValueChange={(value) => setSelectedChart(value as ChartType)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="severity">Severity Distribution</TabsTrigger>
            <TabsTrigger value="category">Incident Categories</TabsTrigger>
            <TabsTrigger value="time">Incidents Over Time</TabsTrigger>
            <TabsTrigger value="status">Resolution Status</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Severity Distribution Chart */}
      <AnimatedTabContent visible={selectedChart === 'severity'}>
        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold dark:text-white">Incidents by Severity</h3>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Distribution of incidents by their severity level. Hover over segments for details.
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="h-64">
            <ChartContainer 
              className="h-full"
              config={{
                Low: { color: getThemeColor(colors.severity.Low) },
                Medium: { color: getThemeColor(colors.severity.Medium) },
                High: { color: getThemeColor(colors.severity.High) }
              }}
            >
              <PieChart>
                <Pie
                  data={severityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  animationDuration={1000}
                  animationBegin={0}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getThemeColor(entry.color)} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltipFormatter />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            Total: {severityData.reduce((sum, item) => sum + item.value, 0)} incidents
          </div>
        </Card>
      </AnimatedTabContent>

      {/* Category Distribution Chart */}
      <AnimatedTabContent visible={selectedChart === 'category'}>
        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold dark:text-white">Incidents by Category</h3>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Distribution of incidents across different categories like Security Breaches, Operational Errors, etc.
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={categoryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                barGap={2}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  allowDecimals={false}
                  className="text-gray-600 dark:text-gray-400"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltipFormatter />} />
                <Bar 
                  dataKey="value" 
                  animationDuration={1500}
                  animationBegin={0}
                  radius={[4, 4, 0, 0]}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getThemeColor(entry.color)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </AnimatedTabContent>

      {/* Status Distribution Chart */}
      <AnimatedTabContent visible={selectedChart === 'status'}>
        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold dark:text-white">Incident Resolution Status</h3>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Current status of all incidents, showing how many are resolved, open, or in progress.
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  animationDuration={1000}
                  animationBegin={0}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getThemeColor(entry.color)} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltipFormatter />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-sm">{value}</span>} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </AnimatedTabContent>

      {/* Time-based Chart */}
      <AnimatedTabContent visible={selectedChart === 'time'} className="lg:col-span-2">
        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold dark:text-white">Incidents Over Time</h3>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Track incidents over time. Solid line shows the overall trend, colored areas show severity breakdown.
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
              
              <Select value={chartView} onValueChange={(value) => setChartView(value as ChartView)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="View by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip content={<CustomTooltipFormatter />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
                
                {/* Average reference line */}
                <ReferenceLine
                  y={averageIncidents}
                  stroke="#888"
                  strokeDasharray="3 3"
                  label={{ 
                    value: `Avg: ${averageIncidents}`, 
                    fill: '#888',
                    fontSize: 12,
                    position: 'insideBottomRight'
                  }}
                />
                
                {/* Individual severity lines */}
                <Line 
                  type="monotone" 
                  dataKey="Low" 
                  stroke={getThemeColor(colors.severity.Low)} 
                  strokeWidth={2}
                  dot={{ r: 3, fill: getThemeColor(colors.severity.Low) }}
                  activeDot={{ r: 5 }}
                  animationDuration={1500}
                  animationBegin={0}
                />
                <Line 
                  type="monotone" 
                  dataKey="Medium" 
                  stroke={getThemeColor(colors.severity.Medium)} 
                  strokeWidth={2}
                  dot={{ r: 3, fill: getThemeColor(colors.severity.Medium) }}
                  activeDot={{ r: 5 }}
                  animationDuration={1500}
                  animationBegin={300}
                />
                <Line 
                  type="monotone" 
                  dataKey="High" 
                  stroke={getThemeColor(colors.severity.High)} 
                  strokeWidth={2}
                  dot={{ r: 3, fill: getThemeColor(colors.severity.High) }}
                  activeDot={{ r: 5 }}
                  animationDuration={1500}
                  animationBegin={600}
                />
                
                {/* Total line */}
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#666" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#666" }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                  label={({ x, y, value }) => (
                    maxIncidentsDay && value === maxIncidentsDay.total ? (
                      <text 
                        x={x} 
                        y={y - 10} 
                        fill="#666" 
                        textAnchor="middle" 
                        fontSize={12}
                      >
                        Peak: {value}
                      </text>
                    ) : null
                  )}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            {chartView === 'monthly' && 'Showing last 12 months of data'}
            {chartView === 'weekly' && 'Showing last 10 weeks of data'}
            {chartView === 'yearly' && 'Showing yearly breakdown'}
          </div>
        </Card>
      </AnimatedTabContent>
    </motion.div>
  );
};

// Helper component for animated tab content
const AnimatedTabContent = ({ 
  children, 
  visible, 
  className = ""
}: { 
  children: React.ReactNode; 
  visible: boolean;
  className?: string;
}) => {
  if (!visible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default IncidentCharts;
