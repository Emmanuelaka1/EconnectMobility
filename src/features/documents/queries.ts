import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, del } from "../../core/api/client";
import { http } from "../../core/api/http";

export type DocumentDto = {
  id?: number;
  name?: string;
  url?: string;
  parentId: string;
  parentType: string; // 'VOITURE' | 'RECETTE' | 'DRIVER' (selon backend)
  description?: string;
  filename?: string;
};

export function useDocumentsByParent(parentId?: string, parentType?: string) {
  return useQuery({
    queryKey: ["documents", { parentId, parentType }],
    queryFn: () => {
      if (!parentId || !parentType) return Promise.resolve([] as DocumentDto[]);
      return get<DocumentDto[]>(`/documents/findDocumentsByParentId`, { parentId, parentType });
    },
    enabled: !!parentId && !!parentType,
    staleTime: 60_000,
  });
}

export function useUploadDocuments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { files: File[]; parentId: string; parentType: string }) => {
      const formData = new FormData();
      payload.files.forEach((f) => formData.append("files", f));
      const res = await http.post(`/documents/uploadMultiples`, formData, {
        params: { parentId: payload.parentId, parentType: payload.parentType },
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (_data, { parentId, parentType }) => {
      qc.invalidateQueries({ queryKey: ["documents", { parentId, parentType }] });
    },
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => del<void>(`/documents/deleteDocument/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useDeleteByParent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ parentId, parentType }: { parentId: string; parentType: string }) =>
      del<void>(`/documents/deleteDocuments/${parentId}/${parentType}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export async function downloadDocument(filename: string) {
  const res = await http.get(`/documents/${filename}`, { responseType: "blob" });
  const blob = res.data as Blob;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
