// Synced from shop/lib/validators/contact.ts. Edit it there, then run `npm run sync:shared`.
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.email("Enter a valid email address").max(200),
  subject: z.string().trim().min(2, "Add a short subject").max(120),
  message: z.string().trim().min(10, "Write at least a sentence or two").max(2000, "Keep it under 2,000 characters"),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({ email: z.email("Enter a valid email address").max(200) });
export type NewsletterInput = z.infer<typeof newsletterSchema>;
