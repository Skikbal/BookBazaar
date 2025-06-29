import { z } from "zod";

const reviewValidationSchema = z.object({
  rating: z.number({ required_error: "Rating is required" }).min(1).max(5),
  review: z.string().optional(),
});

export default reviewValidationSchema;
