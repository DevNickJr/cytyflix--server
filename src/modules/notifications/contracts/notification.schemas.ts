import z from "zod";

export const CreateNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(["inquiry_received", "inquiry_responded", "listing_saved", "system"]),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  metadata: z.record(z.string(), z.any()).default({}),
});

export type CreateNotificationDTO = z.infer<typeof CreateNotificationSchema>;
