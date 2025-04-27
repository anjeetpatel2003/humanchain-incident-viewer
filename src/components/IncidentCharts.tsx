
import { useMemo } from 'react';
import { Card } from './ui/card';
import { motion } from 'framer-motion';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Bar, Pie, ResponsiveContainer, BarChart, PieChart, Cell } from 'recharts';
import { Severity } from '../types/incident';

interface IncidentChartsProps {
  incidents: Array<{
    id: number;
    severity: Severity;
    reported_at: string;
  }>;
}

const IncidentCharts = ({ incidents }: IncidentChartsProps) => {
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
      { name: 'Low', value: counts.Low, color: '#10b981' },
      { name: 'Medium', value: counts.Medium, color: '#f59e0b' },
      { name: 'High', value: counts.High, color: '#ef4444' },
    ];
  }, [incidents]);

  const timeData = useMemo(() => {
    // Group incidents by month
    const months: Record<string, number> = {};
    
    incidents.forEach(incident => {
      const date = new Date(incident.reported_at);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (months[monthYear]) {
        months[monthYear]++;
      } else {
        months[monthYear] = 1;
      }
    });
    
    // Convert to array and sort chronologically
    return Object.entries(months)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA.getTime() - dateB.getTime();
      });
  }, [incidents]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
    >
      <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Incidents by Severity</h3>
        <div className="h-64">
          <ChartContainer 
            className="h-full"
            config={{
              Low: { color: '#10b981' },
              Medium: { color: '#f59e0b' },
              High: { color: '#ef4444' }
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
                label={(entry) => entry.name}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => (
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                  />
                )}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </Card>

      <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Incidents Over Time</h3>
        <div className="h-64">
          <ChartContainer 
            className="h-full"
            config={{
              count: { color: '#6366f1' }
            }}
          >
            <BarChart data={timeData}>
              <Bar dataKey="count" fill="#6366f1" />
              <ChartTooltip
                content={({ active, payload }) => (
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                    labelKey="name"
                  />
                )}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default IncidentCharts;
