import { Stack } from "expo-router";

export default function RootLayout() {
  return (
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
  );
}
