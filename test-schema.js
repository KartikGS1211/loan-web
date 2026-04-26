import { z } from "zod";
import { step7Schema } from "./src/schemas/validationSchema.js";

const schema = step7Schema("business", "self-employed", true);
const data = {
  uploadedFiles: {
    businessRegCert: ["file1"],
    gstReturns: ["file1"]
  },
  signature: "data:image/png;base64,..."
};

const result = schema.safeParse(data);
console.log(JSON.stringify(result, null, 2));
