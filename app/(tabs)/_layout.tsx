import { globalStyles } from "@/styles/globalStyles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, usePathname, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const handleAddTask = () => {
    router.push("/add-task");
  };

  // Define the list of "tab" routes where the FAB should be visible
  const tabRoutes = ["/completed", "/todo"];

  // Show FAB on all tabs except index
  const shouldShowFab = tabRoutes.includes(pathname);

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ tabBarActiveTintColor: "#3B82F6" }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Assistant",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="user" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="todo"
          options={{
            title: "To Do List",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="clock-o" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="completed"
          options={{
            title: "Completed Tasks",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="check" color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Floating Action Button - only show when not on index tab */}
      {shouldShowFab && (
        <TouchableOpacity style={globalStyles.fab} onPress={handleAddTask}>
          <FontAwesome name="plus" size={28} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
