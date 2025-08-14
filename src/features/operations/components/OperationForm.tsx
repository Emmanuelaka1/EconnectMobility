import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OperationSchema, OperationFormValues } from "../schema";
import { useSaveOperation, useUpdateOperation } from "../queries";

type Props = { initial?: Partial<OperationFormValues>; onSuccess?: () => void };

const OperationForm: React.FC<Props> = ({ initial, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<OperationFormValues>({
    resolver: zodResolver(OperationSchema),
    defaultValues: { date: "", type: "", amount: 0, carRef: "", description: "", ...initial },
  });

  const save = useSaveOperation();
  const update = useUpdateOperation();

  const onSubmit = (values: OperationFormValues) => {
    const action = values.id ? update.mutate : save.mutate;
    action(values as any, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm">Date</label>
        <input type="date" {...register("date")} className="w-full border rounded px-3 py-2" />
        {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Type</label>
          <input {...register("type")} className="w-full border rounded px-3 py-2" placeholder="carburant, entretien..." />
          {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Montant</label>
          <input type="number" step="1" {...register("amount", { valueAsNumber: true })} className="w-full border rounded px-3 py-2" />
          {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm">Voiture (ref)</label>
        <input {...register("carRef")} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm">Référence transaction</label>
        <input {...register("reference")} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm">Description</label>
        <textarea {...register("description")} className="w-full border rounded px-3 py-2" />
      </div>
      <button type="submit" className="px-4 py-2 rounded bg-black text-white">Enregistrer</button>
    </form>
  );
};
export default OperationForm;
