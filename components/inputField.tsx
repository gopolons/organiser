import { createInputFieldStyles } from "@/styles/inputFieldStyles";
import { useTheme } from "@/utils/theme";
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
  // Theme declaration
  const theme = useTheme();
  const inputFieldStyles = createInputFieldStyles(theme);

  return (
    <TextInput
      style={[
        inputFieldStyles.input,
        multiline && inputFieldStyles.multilineInput,
      ]}
      placeholder={placeholder}
      placeholderTextColor={theme.inputPlaceholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={multiline ? numberOfLines : 1}
      textAlignVertical={multiline ? "top" : "center"}
      {...props}
    />
  );
};
