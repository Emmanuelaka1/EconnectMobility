import { z } from "zod";

export const RecetteSchema = z.object({
  id: z.number().optional(),
  date: z.string().min(1, "Date requise"),
  carRef: z.string().min(1, "Voiture requise"),
  montant: z.number().min(0, "Montant >= 0"),
  description: z.string().optional().default(""),
});

export type RecetteFormValues = z.infer<typeof RecetteSchema>;
