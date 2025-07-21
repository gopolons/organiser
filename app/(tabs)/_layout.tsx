import { globalStyles } from "@/styles/globalStyles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  const handleAddTask = () => {
    router.push("/add-task");
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
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

      {/* Floating Action Button */}
      <TouchableOpacity style={globalStyles.fab} onPress={handleAddTask}>
        <FontAwesome name="plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
