import { apiFetch } from "@/api/client";
import type { ContactInput } from "@/lib/validators/contact";

export const sendContactMessage = (input: ContactInput) =>
  apiFetch<void>("/contact", { method: "POST", body: input });
export const subscribeToNewsletter = (email: string) =>
  apiFetch<{ alreadySubscribed: boolean }>("/newsletter", { method: "POST", body: { email } });
