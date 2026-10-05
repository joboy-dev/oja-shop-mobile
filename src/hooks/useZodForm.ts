import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues, type FieldValues, type Resolver } from "react-hook-form";
import type { z } from "zod";

/** react-hook-form wired to a zod schema (input type in, parsed output type out). Same as the web's useZodForm. */
export function useZodForm<TSchema extends z.ZodType<FieldValues, FieldValues>>(
  schema: TSchema,
  defaultValues?: DefaultValues<z.input<TSchema>>,
) {
  return useForm<z.input<TSchema>, unknown, z.output<TSchema>>({
    resolver: zodResolver(schema) as unknown as Resolver<z.input<TSchema>, unknown, z.output<TSchema>>,
    defaultValues,
    mode: "onTouched",
  });
}
