import {
  FormAction,
  FormFieldHandler,
  FormState,
  FormValidation,
} from "@/model/FormTypes";
import { TaskData } from "@/model/task";
import {
  addUniqueTagsToArray,
  parseTagsFromText,
  removeTagFromArray,
} from "@/utils/array";
import { validateTaskForm } from "@/utils/validation";
import { useMemo, useReducer } from "react";

// A constant describing the default blank form state
const initialFormState: FormState = {
  name: "",
  description: "",
  dueDate: Date.now(),
  tags: [],
  tagText: "",
  completed: false,
};

// Reducer describing and handling view events
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_DUE_DATE":
      return { ...state, dueDate: action.payload };
    case "SET_TAG_TEXT":
      return { ...state, tagText: action.payload };
    case "ADD_TAGS":
      const newTags = parseTagsFromText(action.payload);
      if (newTags.length === 0) return state;
      return {
        ...state,
        tags: addUniqueTagsToArray(state.tags, newTags),
        tagText: "",
      };
    case "REMOVE_TAG":
      return {
        ...state,
        tags: removeTagFromArray(state.tags, action.payload),
      };
    case "RESET_FORM":
      return initialFormState;
    case "POPULATE_FORM":
      return {
        name: action.payload.name,
        description: action.payload.description,
        dueDate: action.payload.dueDate,
        tags: action.payload.tags,
        tagText: "",
        completed: action.payload.completed,
      };
    case "SET_COMPLETION":
      return {
        ...state,
        completed: action.payload,
      };
    default:
      return state;
  }
};

// A function for creating the field handler
const createFieldHandler = <T>(
  dispatch: React.Dispatch<FormAction>,
  actionType: FormAction["type"],
): FormFieldHandler<T> => {
  return (value: T) => {
    dispatch({ type: actionType, payload: value } as FormAction);
  };
};

// A function for creating the tag field input handler
const createTagInputHandler =
  (dispatch: React.Dispatch<FormAction>) =>
  (text: string): void => {
    if (/\s$/.test(text)) {
      // if text ends with whitespace, commit the tags
      dispatch({ type: "ADD_TAGS", payload: text });
    } else {
      // otherwise just update the tag text
      dispatch({ type: "SET_TAG_TEXT", payload: text });
    }
  };

// A function for creating the tag field removal handler
const createTagRemovalHandler =
  (dispatch: React.Dispatch<FormAction>) =>
  (tag: string): void => {
    dispatch({ type: "REMOVE_TAG", payload: tag });
  };

// An interface describing the task form return, that will be received by the view
interface UseTaskFormReturn {
  formState: FormState;
  validation: FormValidation;
  handlers: {
    setName: FormFieldHandler<string>;
    setDescription: FormFieldHandler<string>;
    setDueDate: FormFieldHandler<number>;
    handleTagInput: FormFieldHandler<string>;
    handleTagSubmit: () => void;
    removeTag: FormFieldHandler<string>;
    resetForm: () => void;
    populateData: FormFieldHandler<TaskData>;
    setCompletion: FormFieldHandler<boolean>;
  };
}

// A function returning the UseTaskFormReturn
export const useTaskForm = (): UseTaskFormReturn => {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);

  const handlers = useMemo(
    () => ({
      setName: createFieldHandler<string>(dispatch, "SET_NAME"),
      setDescription: createFieldHandler<string>(dispatch, "SET_DESCRIPTION"),
      setDueDate: createFieldHandler<number>(dispatch, "SET_DUE_DATE"),
      handleTagInput: createTagInputHandler(dispatch),
      handleTagSubmit: () => {
        if (formState.tagText.trim().length > 0) {
          dispatch({ type: "ADD_TAGS", payload: formState.tagText + " " });
        }
      },
      removeTag: createTagRemovalHandler(dispatch),
      resetForm: () => dispatch({ type: "RESET_FORM" }),
      populateData: createFieldHandler<TaskData>(dispatch, "POPULATE_FORM"),
      setCompletion: createFieldHandler<boolean>(dispatch, "SET_COMPLETION"),
    }),
    [formState.tagText],
  );

  const validation = useMemo(() => validateTaskForm(formState), [formState]);

  return {
    formState,
    validation,
    handlers,
  };
};
