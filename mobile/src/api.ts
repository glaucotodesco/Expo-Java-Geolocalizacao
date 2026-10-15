export type SavedLocation = {
  id: number;
  name: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
};

// Troque pelo IP LAN do computador onde o Spring Boot está executando.
// Exemplo: http://192.168.1.100:8080
export const API_BASE_URL = 'http://192.168.1.100:8080';

async function assertOk(response: Response): Promise<void> {
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`API respondeu HTTP ${response.status}: ${details}`);
  }
}

export async function saveLocation(point: {
  name: string;
  latitude: number;
  longitude: number;
}): Promise<SavedLocation> {
  const response = await fetch(`${API_BASE_URL}/api/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(point),
  });
  await assertOk(response);
  return (await response.json()) as SavedLocation;
}

export async function getLocations(): Promise<SavedLocation[]> {
  const response = await fetch(`${API_BASE_URL}/api/locations`);
  await assertOk(response);
  return (await response.json()) as SavedLocation[];
}
