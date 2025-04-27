
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
}

export type SortOrder = 'newest' | 'oldest';
