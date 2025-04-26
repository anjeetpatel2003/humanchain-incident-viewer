
import { useState } from 'react';
import Navbar from '../components/Navbar';
import IncidentCard from '../components/IncidentCard';
import Controls from '../components/Controls';
import NewIncidentForm from '../components/NewIncidentForm';
import { Incident, SortOrder } from '../types/incident';
import { mockIncidents } from '../data/mockIncidents';
import { motion } from 'framer-motion';

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
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Safety Incidents
              </h1>
            </div>
            
            <Controls
              selectedSeverity={selectedSeverity}
              onSeverityChange={setSelectedSeverity}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {filteredAndSortedIncidents.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                  <p className="text-gray-500 text-lg">No incidents found matching the current filters.</p>
                </div>
              ) : (
                filteredAndSortedIncidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))
              )}
            </motion.div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <NewIncidentForm onSubmit={handleNewIncident} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
