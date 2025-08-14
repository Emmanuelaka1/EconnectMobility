import { z } from "zod";

export const VoitureSchema = z.object({
  id: z.number().optional(),
  ref: z.string().min(1, "Référence requise"),
  marque: z.string().min(1, "Marque requise"),
  modele: z.string().min(1, "Modèle requis"),
  plaque: z.string().min(1, "Plaque requise"),
  actif: z.boolean().default(true),
});

export type VoitureFormValues = z.infer<typeof VoitureSchema>;
