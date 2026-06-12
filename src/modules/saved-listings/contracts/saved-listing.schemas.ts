import z from "zod";

export const SavePropertySchema = z.object({
  propertyId: z.string().uuid(),
});

export type SavePropertyDTO = z.infer<typeof SavePropertySchema>;
