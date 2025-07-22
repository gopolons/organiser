import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-task"
          options={{
            title: "Add Task",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="task-details"
          options={{
            title: "Task Details",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
