import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VoitureSchema, VoitureFormValues } from "../schema";
import { useSaveVoiture, useUpdateVoiture } from "../queries";

type Props = {
  initial?: Partial<VoitureFormValues>;
  onSuccess?: () => void;
};

const VoitureForm: React.FC<Props> = ({ initial, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<VoitureFormValues>({
    resolver: zodResolver(VoitureSchema),
    defaultValues: {
      ref: "", marque: "", modele: "", plaque: "", actif: true, ...initial,
    },
  });

  const save = useSaveVoiture();
  const update = useUpdateVoiture();

  const onSubmit = (values: VoitureFormValues) => {
    const action = values.id ? update.mutate : save.mutate;
    action(values as any, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm">Référence</label>
        <input {...register("ref")} className="w-full border rounded px-3 py-2" placeholder="REF-001" />
        {errors.ref && <p className="text-red-500 text-xs">{errors.ref.message}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Marque</label>
          <input {...register("marque")} className="w-full border rounded px-3 py-2" />
          {errors.marque && <p className="text-red-500 text-xs">{errors.marque.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Modèle</label>
          <input {...register("modele")} className="w-full border rounded px-3 py-2" />
          {errors.modele && <p className="text-red-500 text-xs">{errors.modele.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm">Plaque</label>
        <input {...register("plaque")} className="w-full border rounded px-3 py-2" />
        {errors.plaque && <p className="text-red-500 text-xs">{errors.plaque.message}</p>}
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("actif")} />
        <span>Actif</span>
      </div>
      <button type="submit" className="px-4 py-2 rounded bg-black text-white">
        Enregistrer
      </button>
    </form>
  );
};

export default VoitureForm;
