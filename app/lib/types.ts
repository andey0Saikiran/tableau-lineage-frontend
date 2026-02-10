export interface Stats {
  datasources: number;
  calculated: number;
  raw: number;
  parameters: number;
  lod: number;
  total: number;
}

export interface UploadResponse {
  html: string;
  stats: Stats;
}

export interface MetricConfig {
  label: string;
  icon: string;
  color: string;
}