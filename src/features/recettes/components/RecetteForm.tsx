import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecetteSchema, RecetteFormValues } from "../schema";
import { useSaveRecette } from "../queries";

type Props = {
  initial?: Partial<RecetteFormValues>;
  onSuccess?: () => void;
};

const RecetteForm: React.FC<Props> = ({ initial, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<RecetteFormValues>({
    resolver: zodResolver(RecetteSchema),
    defaultValues: {
      date: "",
      carRef: "",
      montant: 0,
      description: "",
      ...initial,
    },
  });

  const save = useSaveRecette();

  const onSubmit = (values: RecetteFormValues) => {
    save.mutate(values, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm">Date</label>
        <input type="date" {...register("date")} className="input input-bordered w-full" />
        {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Voiture</label>
        <input type="text" {...register("carRef")} className="input input-bordered w-full" placeholder="Ref voiture" />
        {errors.carRef && <p className="text-red-500 text-xs">{errors.carRef.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Montant</label>
        <input type="number" step="1" {...register("montant", { valueAsNumber: true })} className="input input-bordered w-full" />
        {errors.montant && <p className="text-red-500 text-xs">{errors.montant.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Description</label>
        <textarea {...register("description")} className="textarea textarea-bordered w-full" />
      </div>

      <button type="submit" className="btn btn-primary" disabled={save.isPending}>
        {save.isPending ? "Enregistrement..." : "Enregistrer"}
      </button>
      {save.isError && <p className="text-red-500 text-sm">Erreur: {(save.error as any)?.message}</p>}
    </form>
  );
};

export default RecetteForm;
