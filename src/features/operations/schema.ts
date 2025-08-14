import { z } from "zod";

export const OperationSchema = z.object({
  id: z.number().optional(),
  date: z.string().min(1, "Date requise"),
  type: z.string().min(1, "Type requis"), // ex: carburant, entretien, peage...
  amount: z.number().min(0, "Montant >= 0"),
  carRef: z.string().min(1, "Voiture requise").optional(),
  reference: z.string().optional(),
  description: z.string().optional().default(""),
});

export type OperationFormValues = z.infer<typeof OperationSchema>;
