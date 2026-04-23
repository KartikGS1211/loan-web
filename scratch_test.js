import { z } from 'zod';

export const step7Schema = z.object({
  documents: z.array(z.any()).min(1, 'Please upload at least one document'),
  signature: z.any().refine((val) => val !== null && val !== undefined && val !== '', 'Signature is required'),
});

const data = {
  documents: [{ name: 'test.pdf' }],
  signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
};

const result = step7Schema.safeParse(data);
console.log(result);
