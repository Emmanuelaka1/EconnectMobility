import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DocumentSchema, DocumentFormValues } from "../schema";
import { useUploadDocuments } from "../queries";

type Props = {
  onSuccess?: () => void;
};

const UploadForm: React.FC<Props> = ({ onSuccess }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<DocumentFormValues>({
    resolver: zodResolver(DocumentSchema),
    defaultValues: { parentId: "", parentType: "voiture", description: "" },
  });

  const upload = useUploadDocuments();

  const onSubmit = (values: DocumentFormValues) => {
    upload.mutate({ files, parentId: values.parentId, parentType: values.parentType }, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm">Type parent</label>
          <select {...register("parentType")} className="w-full border rounded px-3 py-2">
            <option value="voiture">Voiture</option>
            <option value="recette">Recette</option>
            <option value="driver">Driver</option>
          </select>
          {errors.parentType && <p className="text-red-500 text-xs">{errors.parentType.message}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm">Parent ID</label>
          <input {...register("parentId")} className="w-full border rounded px-3 py-2" placeholder="ex: CAR-001 ou id numérique" />
          {errors.parentId && <p className="text-red-500 text-xs">{errors.parentId.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm">Fichiers</label>
        <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
        <div className="text-xs opacity-70 mt-1">{files.length} fichier(s) sélectionné(s)</div>
      </div>
      <button type="submit" className="px-4 py-2 rounded bg-black text-white" disabled={upload.isPending}>
        {upload.isPending ? "Upload…" : "Uploader"}
      </button>
      {upload.isError && <p className="text-red-500 text-sm">Erreur: {(upload.error as any)?.message}</p>}
    </form>
  );
};

export default UploadForm;
