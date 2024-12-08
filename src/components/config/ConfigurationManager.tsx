import React, { useState, useEffect } from 'react';
import { ConfigList } from './ConfigList';
import { ConfigForm } from './ConfigForm';
import { configStore, GPTConfig } from '../../utils/gptConfig';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ConfigurationManagerProps {
  onBack: () => void;
}

export const ConfigurationManager: React.FC<ConfigurationManagerProps> = ({ onBack }) => {
  const [configs, setConfigs] = useState<Map<string, GPTConfig>>(new Map());
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    setConfigs(configStore.getAllCustomConfigs());
    const unsubscribe = configStore.subscribeToConfigChanges(newConfigs => {
      setConfigs(new Map(newConfigs));
    });
    return unsubscribe;
  }, []);

  const handleAddConfig = () => {
    setSelectedConfig(null);
    setIsFormOpen(true);
  };

  const handleEditConfig = (name: string) => {
    setSelectedConfig(name);
    setIsFormOpen(true);
  };

  const handleDeleteConfig = (name: string) => {
    try {
      configStore.removeCustomConfig(name);
      toast.success(`Configuration "${name}" deleted successfully`);
    } catch (error) {
      toast.error(`Failed to delete configuration: ${error.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex-1 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Model Configurations
            </h2>
            <button
              onClick={handleAddConfig}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Configuration
            </button>
          </div>
        </div>

        <ConfigList
          configs={configs}
          onEdit={handleEditConfig}
          onDelete={handleDeleteConfig}
        />

        <ConfigForm
          isOpen={isFormOpen}
          configName={selectedConfig}
          onClose={() => setIsFormOpen(false)}
        />
      </div>
    </div>
  );
};