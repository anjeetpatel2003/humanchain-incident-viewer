
import { useState } from 'react';
import Navbar from '../components/Navbar';
import IncidentCard from '../components/IncidentCard';
import Controls from '../components/Controls';
import NewIncidentForm from '../components/NewIncidentForm';
import { Incident, SortOrder } from '../types/incident';
import { mockIncidents } from '../data/mockIncidents';

const Index = () => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const filteredAndSortedIncidents = incidents
    .filter((incident) =>
      selectedSeverity === 'all' ? true : incident.severity === selectedSeverity
    )
    .sort((a, b) => {
      const dateA = new Date(a.reported_at).getTime();
      const dateB = new Date(b.reported_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const handleNewIncident = (newIncident: Omit<Incident, 'id'>) => {
    const incident: Incident = {
      ...newIncident,
      id: Math.max(...incidents.map((i) => i.id)) + 1,
    };
    setIncidents([incident, ...incidents]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">AI Safety Incidents</h1>
            <Controls
              selectedSeverity={selectedSeverity}
              onSeverityChange={setSelectedSeverity}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />
            <div className="space-y-4">
              {filteredAndSortedIncidents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No incidents found matching the current filters.
                </div>
              ) : (
                filteredAndSortedIncidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <NewIncidentForm onSubmit={handleNewIncident} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
