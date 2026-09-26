import z from 'zod';
import { EventType } from '../domain/analytics-event';

const EventTypeValues = Object.values(EventType) as [string, ...string[]];

export const TrackEventSchema = z.object({
  body: z.object({
    eventType: z.enum(EventTypeValues, { error: 'Invalid event type' }),
    targetId: z
      .string({ error: 'targetId is required' })
      .min(1, { error: 'targetId is required' }),
    metadata: z
      .record(z.string({ error: 'Metadata key must be a string' }), z.unknown())
      .optional(),
  }),
});

export type TrackEventDTO = z.infer<typeof TrackEventSchema>['body'];

export const PopularQuerySchema = z.object({
  query: z.object({
    limit: z
      .string({ error: 'Limit must be a number' })
      .transform(val => parseInt(val || '10', 10))
      .pipe(
        z.number({ error: 'Limit must be a positive number' }).int().positive()
      )
      .optional()
      .default(10),
    days: z
      .string({ error: 'Days must be a number' })
      .transform(val => parseInt(val || '30', 10))
      .pipe(
        z.number({ error: 'Days must be a positive number' }).int().positive()
      )
      .optional()
      .default(30),
  }),
});

export type PopularQueryDTO = z.infer<typeof PopularQuerySchema>['query'];
