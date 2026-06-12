import { z } from 'zod';

export const PaginationQuerySchema = z.object({
    query: z.object({
        page: z.string({ error: 'page must be a number' })
            .refine(val => parseInt(val || '1'))
            .transform(val => parseInt(val || '1', 10)) // convert string → number
            .pipe(
                z
                .number({ error: 'page must be a number' })
                .int({ error: 'page must be an integer' })
                .positive({ error: 'page must be a positive number' })
            )
            .optional()
            .default(1),
        limit: z.string({ error: 'limit must be a number' })
            .refine(val => parseInt(val || '1'))
            .transform(val => parseInt(val || '1', 10)) // convert string → number
            .pipe(
                z
                .number({ error: 'limit must be a number' })
                .int({ error: 'limit must be an integer' })
                .positive({ error: 'limit must be a positive number' })
            )
            .optional()
            .default(1),
        search: z.string({ error: 'search must be a string' }).optional(),
    })
});

export type PaginationQueryDTO = z.infer<typeof PaginationQuerySchema>["query"];


export const IdParam = z.object({
    params: z.object({
        id: z.string().min(1, { error: 'Id must be a string' })
    })
});

export type IdParamDTO = z.infer<typeof IdParam>['params'];

