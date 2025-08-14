import { z } from "zod";

export const DocumentSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  url: z.string().optional(),
  parentId: z.string().min(1, "ParentId requis"),
  parentType: z.enum(["voiture", "recette", "driver"]).transform((v) => v.toUpperCase()),
  description: z.string().optional().default(""),
});

export type DocumentFormValues = z.infer<typeof DocumentSchema>;
