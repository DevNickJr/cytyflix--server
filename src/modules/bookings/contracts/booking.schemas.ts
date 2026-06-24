import z from "zod";

export const CreateBookingSchema = z.object({
  body: z.object({
    agentId: z.string().min(1),
    propertyId: z.string().min(1),
    scheduledDate: z.string().min(1),
    scheduledTime: z.string().min(1),
    notes: z.string().max(1000).optional(),
  }),
});

export type CreateBookingDTO = z.infer<typeof CreateBookingSchema>["body"];
