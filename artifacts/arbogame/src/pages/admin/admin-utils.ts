export interface UploadResult {
  objectPath: string;
  uploadURL: string;
}

import { API_BASE } from "@/lib/api-base";

export async function uploadFileToStorage(file: File): Promise<UploadResult> {
  const presignRes = await fetch(`${API_BASE}/storage/uploads/request-url`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: file.name,
      size: file.size,
      contentType: file.type || "application/octet-stream",
    }),
  });
  if (!presignRes.ok) {
    throw new Error(`Falha ao gerar URL de upload (HTTP ${presignRes.status})`);
  }
  const presign = (await presignRes.json()) as { uploadURL: string; objectPath: string };

  const putRes = await fetch(presign.uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!putRes.ok) {
    throw new Error(`Falha ao enviar arquivo (HTTP ${putRes.status})`);
  }
  return { objectPath: presign.objectPath, uploadURL: presign.uploadURL };
}
