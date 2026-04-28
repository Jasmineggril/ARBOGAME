export const API_BASE = `${import.meta.env.BASE_URL}api`;

export function objectUrl(objectPath: string | null | undefined): string | undefined {
  if (!objectPath) return undefined;
  if (objectPath.startsWith("http")) return objectPath;
  return `${API_BASE}/storage${objectPath}`;
}
