import React from 'react';
import { Settings, Trash2, Zap } from 'lucide-react';
import { GPTConfig } from '../../utils/gptConfig';

interface ConfigListProps {
  configs: Map<string, GPTConfig>;
  onEdit: (name: string) => void;
  onDelete: (name: string) => void;
}

export const ConfigList: React.FC<ConfigListProps> = ({
  configs,
  onEdit,
  onDelete,
}) => {
  if (configs.size === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No custom configurations yet. Add one to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from(configs.entries()).map(([name, config]) => (
        <div
          key={name}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500 mt-1">{config.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(name)}
                className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-50"
                title="Edit Configuration"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(name)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-50"
                title="Delete Configuration"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Temperature: {config.temperature}</span>
            </div>
            <div>Max Tokens: {config.maxTokens}</div>
            <div>Cost: ${config.costPer1kTokens}/1k tokens</div>
          </div>

          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700">Features:</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {config.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
