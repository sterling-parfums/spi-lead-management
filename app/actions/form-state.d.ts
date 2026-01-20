export type FormState<T = unknown> =
  | { ok: true; data?: T }
  | {
      ok: false;
      fieldErrors?: Record<string, string[] | undefined>;
      formError?: string;
    };
