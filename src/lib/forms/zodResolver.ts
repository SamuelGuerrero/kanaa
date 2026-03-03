import { type z } from "zod";

import type { FieldValues, Resolver, FieldErrors } from "react-hook-form";

type ResolverError = {
  type: string;
  message: string;
};

export const zodResolver = <TFieldValues extends FieldValues>(
  schema: z.ZodType<TFieldValues>,
): Resolver<TFieldValues> => {
  return (async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: Record<string, ResolverError> = {};

    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key !== "string" || errors[key]) continue;
      errors[key] = {
        type: issue.code,
        message: issue.message,
      };
    }

    return {
      values: {} as never,
      errors: errors as unknown as FieldErrors<TFieldValues>,
    };
  }) as Resolver<TFieldValues>;
};
