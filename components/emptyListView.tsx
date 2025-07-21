import { tableComponentsStyles } from "@/styles/tableComponentsStyles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "react-native";

// Structure defining
type Props = {
  title: string;
  description: string;
  iconName: React.ComponentProps<typeof FontAwesome>["name"];
};

// A reusable component to show a placeholder for an empty list
export const EmptyListView = ({ title, description, iconName }: Props) => (
  <View style={tableComponentsStyles.placeholderContainer}>
    <View style={tableComponentsStyles.iconContainer}>
      <FontAwesome name={iconName} size={64} color="#8E8E93" />
    </View>
    <Text style={tableComponentsStyles.titleText}>{title}</Text>
    <Text style={tableComponentsStyles.descriptionText}>{description}</Text>
  </View>
);
