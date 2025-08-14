import { z } from "zod";

export const WeekSchema = z.object({
  id: z.string().optional(),
  weekNumber: z.number().min(1).max(53),
  year: z.number().min(2000).max(2100),
  startDate: z.string().min(1, "Date de début requise"),
  endDate: z.string().min(1, "Date de fin requise"),
});

export type WeekFormValues = z.infer<typeof WeekSchema>;
