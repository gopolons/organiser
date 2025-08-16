import { syncFromWidget } from "@/services/persistence";
import { useTheme } from "@/utils/theme";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// A setting for ensure any route can link back to tab view
export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  // Theme declaration
  const theme = useTheme();

  // Sync widget data
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === "active") {
        // App came to foreground - sync from widget first
        await syncFromWidget();
      }
    };

    const initialSync = async () => {
      try {
        // When app starts: pull from widget, update local, then push back
        await syncFromWidget();
      } catch (error) {
        console.error("Initial sync failed:", error);
      }
    };

    // Run initial sync on app launch
    initialSync();

    // Listen for app coming to foreground
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => subscription?.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.textPrimary,
          headerTitleStyle: {
            color: theme.textPrimary,
          },
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
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
