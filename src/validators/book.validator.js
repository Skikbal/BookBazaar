import { z } from "zod";

const bookValidationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  author: z.string().min(3, "Author must be at least 3 characters long"),
  genre: z.array(z.string()).min(1, "At least one genre is required"),
  language: z.string().optional(),
  publisher: z.string({ required_error: "Publisher is required" }),
  publicationDate: z.date().max(new Date(), "Publication date cannot be in the future"),
  price: z.number({ required_error: "Price is required" }),
});

export default bookValidationSchema;
