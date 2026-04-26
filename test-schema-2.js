import { z } from "zod";

const schema = z.object({
  uploadedFiles: z.record(z.any()).optional(),
  signature: z.string().nullable(),
});

console.log(schema.safeParse({ uploadedFiles: { a: 1 }, signature: null }));
