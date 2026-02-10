import { UploadResponse } from './types';
import { API_CONFIG } from './constants';

export class UploadError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'UploadError';
  }
}

export async function uploadWorkbook(file: File, signal?: AbortSignal): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  if (process.env.NODE_ENV === 'development') {
    console.time('Fetch');
  }
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD}`, {
    method: 'POST',
    body: formData,
    signal,
  });
  if (process.env.NODE_ENV === 'development') {
    console.timeEnd('Fetch');
  }

  if (!response.ok) {
    const error = await response.text();
    throw new UploadError(error || 'Upload failed', response.status);
  }

  if (process.env.NODE_ENV === 'development') {
    console.time('Parse Headers');
  }
  const datasources = parseInt(response.headers.get('X-Datasources') || '0');
  const calculated = parseInt(response.headers.get('X-Calculated') || '0');
  const raw = parseInt(response.headers.get('X-Raw') || '0');
  const parameters = parseInt(response.headers.get('X-Parameters') || '0');
  const lod = parseInt(response.headers.get('X-LOD') || '0');
  if (process.env.NODE_ENV === 'development') {
    console.timeEnd('Parse Headers');
  }

  if (process.env.NODE_ENV === 'development') {
    console.time('Parse HTML');
  }
  const html = await response.text();
  if (process.env.NODE_ENV === 'development') {
    console.timeEnd('Parse HTML');
  }

  return {
    html,
    stats: {
      datasources,
      calculated,
      raw,
      parameters,
      lod,
      total: calculated + raw,
    },
  };
}