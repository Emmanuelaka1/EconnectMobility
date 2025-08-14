import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WeekSchema, WeekFormValues } from "../schema";
import { useSaveWeek, useUpdateWeek } from "../queries";

type Props = { initial?: Partial<WeekFormValues>; onSuccess?: () => void };

const WeekForm: React.FC<Props> = ({ initial, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<WeekFormValues>({
    resolver: zodResolver(WeekSchema),
    defaultValues: {
      weekNumber: 1,
      year: new Date().getFullYear(),
      startDate: "",
      endDate: "",
      ...initial,
    },
  });

  const save = useSaveWeek();
  const update = useUpdateWeek();

  const onSubmit = (values: WeekFormValues) => {
    const action = values.id ? update.mutate : save.mutate;
    action(values as any, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Semaine #</label>
          <input type="number" {...register("weekNumber", { valueAsNumber: true })} className="w-full border rounded px-3 py-2" />
          {errors.weekNumber && <p className="text-red-500 text-xs">{errors.weekNumber.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Année</label>
          <input type="number" {...register("year", { valueAsNumber: true })} className="w-full border rounded px-3 py-2" />
          {errors.year && <p className="text-red-500 text-xs">{errors.year.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Date début</label>
          <input type="date" {...register("startDate")} className="w-full border rounded px-3 py-2" />
          {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Date fin</label>
          <input type="date" {...register("endDate")} className="w-full border rounded px-3 py-2" />
          {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate.message}</p>}
        </div>
      </div>
      <button type="submit" className="px-4 py-2 rounded bg-black text-white">Enregistrer</button>
    </form>
  );
};
export default WeekForm;
