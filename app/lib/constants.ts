// API configuration for backend connection
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    UPLOAD: '/upload',
  },
} as const;

export const METRIC_CONFIGS = [
  {
    label: 'Data Sources',
    icon: '🗄️',
    color: 'from-[#0ea5e9] to-[#06b6d4]',
  },
  {
    label: 'Calculated Fields',
    icon: '🧮',
    color: 'from-[#8b5cf6] to-[#a855f7]',
  },
  {
    label: 'Raw Fields',
    icon: '📊',
    color: 'from-[#22c55e] to-[#10b981]',
  },
  {
    label: 'Parameters',
    icon: '⚙️',
    color: 'from-[#f59e0b] to-[#eab308]',
  },
  {
    label: 'LOD Calculations',
    icon: '🎯',
    color: 'from-[#ec4899] to-[#f472b6]',
  },
] as const;

export const FILE_CONFIG = {
  ACCEPTED_TYPES: '.twbx',
  MAX_SIZE_MB: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB || '100'),
} as const;