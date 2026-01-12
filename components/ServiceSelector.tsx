'use client';

import { Bot, Eye, Sparkles } from 'lucide-react';

export type ServiceType = 'ml-studio' | 'vision';

interface ServiceSelectorProps {
  selectedService: ServiceType;
  onServiceChange: (service: ServiceType) => void;
}

const services = [
  {
    id: 'ml-studio' as ServiceType,
    name: 'Azure ML Studio',
    description: 'Test deployed ML models',
    icon: Bot,
    color: 'from-azure-500 to-blue-600',
    activeColor: 'from-azure-500/30 to-blue-600/30',
    borderColor: 'border-azure-500/50',
    iconBg: 'bg-azure-500/20',
    iconColor: 'text-azure-400',
  },
  {
    id: 'vision' as ServiceType,
    name: 'Azure AI Vision',
    description: 'Image Analysis API',
    icon: Eye,
    color: 'from-purple-500 to-pink-600',
    activeColor: 'from-purple-500/30 to-pink-600/30',
    borderColor: 'border-purple-500/50',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
  },
];

export default function ServiceSelector({ selectedService, onServiceChange }: ServiceSelectorProps) {
  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <h2 className="text-white font-medium">Select Azure Service</h2>
      </div>

      {/* Service Toggle Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.id;

          return (
            <button
              key={service.id}
              onClick={() => onServiceChange(service.id)}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${
                isSelected
                  ? `bg-gradient-to-br ${service.activeColor} ${service.borderColor} shadow-lg`
                  : 'bg-dark-800/50 border-dark-600 hover:border-dark-500 hover:bg-dark-800'
              }`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 rounded-full text-[10px] text-white font-bold flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  ACTIVE
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${service.iconColor}`} />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${isSelected ? 'text-white' : 'text-dark-200'}`}>
                    {service.name}
                  </h3>
                  <p className={`text-sm ${isSelected ? 'text-dark-300' : 'text-dark-400'}`}>
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Bottom gradient line when selected */}
              {isSelected && (
                <div className={`absolute bottom-0 left-4 right-4 h-1 rounded-full bg-gradient-to-r ${service.color}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Educational note */}
      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <p className="text-xs text-amber-300">
          <strong>💡 Learning Note:</strong> Azure offers multiple AI services. 
          <strong> ML Studio</strong> hosts your custom trained models, while 
          <strong> AI Vision</strong> provides pre-built image analysis capabilities.
        </p>
      </div>
    </div>
  );
}

