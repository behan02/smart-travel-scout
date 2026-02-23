import { z } from "zod";

export const responseSchema = z.object({
    results: z.array(
        z.object({
            id: z.number(),
            reason: z.string()
        })
    )
});