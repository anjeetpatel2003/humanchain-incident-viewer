
export type Severity = 'Low' | 'Medium' | 'High';

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: Severity;
  reported_at: string;
  category?: 'Security Breach' | 'Operational Error' | 'Injury' | 'Other';
  location?: string;
  affectedSystems?: string;
  impactScope?: string;
  status?: 'Open' | 'Resolved' | 'In Progress';
  resolutionTime?: number; // Time in hours to resolve the incident
}

export type SortOrder = 'newest' | 'oldest';

export type ChartView = 'monthly' | 'weekly' | 'yearly';

export type ChartType = 'severity' | 'category' | 'time' | 'status';
