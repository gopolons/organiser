import { inputFieldStyles } from "@/styles/inputFieldStyles";
import { TextInput, TextInputProps } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
} & Omit<TextInputProps, "value" | "onChangeText" | "placeholder">;

// Reusable text field component
export const InputField = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  ...props
}: Props) => {
  return (
    <TextInput
      style={[
        inputFieldStyles.input,
        multiline && inputFieldStyles.multilineInput,
      ]}
      placeholder={placeholder}
      placeholderTextColor={"#C7C7CD"}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={multiline ? numberOfLines : 1}
      textAlignVertical={multiline ? "top" : "center"}
      {...props}
    />
  );
};
