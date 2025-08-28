import { TaskData } from "./task";

// A structure describing the content of the form state
export interface FormState {
  name: string;
  description: string;
  dueDate: number;
  tags: string[];
  tagText: string;
  completed: boolean;
}

// A structure describing the result of FLV running on the form
export interface FormValidation {
  isValid: boolean;
  errors: string[];
  fieldErrors: {
    title?: string;
    description?: string;
  };
}

// A type describing events when interacting with the form
export type FormAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_DUE_DATE"; payload: number }
  | { type: "SET_TAG_TEXT"; payload: string }
  | { type: "ADD_TAGS"; payload: string }
  | { type: "REMOVE_TAG"; payload: string }
  | { type: "RESET_FORM" }
  | { type: "POPULATE_FORM"; payload: TaskData }
  | { type: "SET_COMPLETION"; payload: boolean };

// Function signatures
export type FormFieldHandler<T> = (value: T) => void;
export type FormSubmitHandler = (formState: FormState) => Promise<void>;
