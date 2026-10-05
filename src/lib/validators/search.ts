// Synced from shop/lib/validators/search.ts. Edit it there, then run `npm run sync:shared`.
import { z } from "zod";

export const searchQuerySchema = z.string().trim().min(2).max(80);
