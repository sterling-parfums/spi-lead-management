import { FormState } from "@/app/actions/form-state";
import { Box } from "@mui/material";

type ErrorMessageProps = {
  state: FormState | null;
  name: string;
};
export function ErrorMessage({ state, name }: ErrorMessageProps) {
  if (!state || state.ok || !state?.fieldErrors) {
    return null;
  }

  return (
    state.fieldErrors[name] && (
      <Box color="error.main">{state.fieldErrors[name]}</Box>
    )
  );
}
