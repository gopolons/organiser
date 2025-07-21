import { buttonStyles } from "@/styles/buttonStyles";
import { Text, TouchableOpacity } from "react-native";

type ButtonType = "default" | "destructive";

type Props = {
  title: string;
  type?: ButtonType;
  onPress?: () => void;
  disabled?: boolean;
};

// A reusable app button component
export const AppButton = ({
  title,
  type = "default",
  onPress,
  disabled = false,
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        buttonStyles.button,
        type === "destructive" && buttonStyles.destructive,
        disabled && buttonStyles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={buttonStyles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
