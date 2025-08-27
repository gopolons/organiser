import { FormState, FormValidation } from "../model/FormTypes";

// Function for validating task form
export const validateTaskForm = (formState: FormState): FormValidation => {
  const errors: string[] = [];
  const fieldErrors: FormValidation["fieldErrors"] = {};

  if (!formState.name.trim()) {
    errors.push("Name is required");
    fieldErrors.title = "Please enter a task name";
  }

  if (formState.name.trim().length > 100) {
    errors.push("Name too long");
    fieldErrors.title = "Name must be 100 characters or less";
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors,
  };
};
