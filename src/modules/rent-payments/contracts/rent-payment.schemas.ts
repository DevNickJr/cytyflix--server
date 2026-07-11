import z from "zod";

export const CreateRentPaymentSchema = z.object({
  body: z.object({
    propertyId: z.string().min(1),
    ownerId: z.string().min(1),
    amount: z.number().positive(),
    moveInDate: z.string().min(1),
  }),
});

export type CreateRentPaymentDTO = z.infer<typeof CreateRentPaymentSchema>["body"];
