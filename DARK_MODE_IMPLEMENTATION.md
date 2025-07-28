# Dark Mode Implementation

This document explains the dark mode implementation in the Organiser app.

## Overview

The app now supports both light and dark modes, automatically adapting to the user's system preference. The implementation uses React Native's `useColorScheme` hook to detect the current color scheme.

## Architecture

### Theme System

The theme system is built around a centralized theme configuration in `utils/theme.ts`:

- **ThemeColors Interface**: Defines all color properties used throughout the app
- **Light Theme**: Contains all colors for light mode
- **Dark Theme**: Contains all colors for dark mode
- **useTheme Hook**: Returns the appropriate theme based on system preference

### Key Features

1. **Automatic Detection**: The app automatically detects and responds to system color scheme changes
2. **Comprehensive Coverage**: All UI components have been updated to support both themes
3. **Consistent Design**: Colors are carefully chosen to maintain good contrast and readability in both modes

## Color Categories

The theme system organizes colors into logical categories:

### Background Colors

- `background`: Main app background
- `surface`: Card and component backgrounds
- `surfaceSecondary`: Secondary surface backgrounds

### Text Colors

- `textPrimary`: Primary text color
- `textSecondary`: Secondary text color
- `textTertiary`: Tertiary text color
- `textDisabled`: Disabled text color

### Border Colors

- `border`: Primary border color
- `borderSecondary`: Secondary border color

### Accent Colors

- `primary`: Primary brand color
- `primaryLight`: Light variant of primary color
- `success`: Success state color
- `warning`: Warning state color
- `error`: Error state color

### Status Colors

- `pending`: Pending task status
- `completed`: Completed task status
- `overdue`: Overdue task status

### Specialized Colors

- `inputBackground`: Input field backgrounds
- `inputPlaceholder`: Input placeholder text
- `calendarBackground`: Calendar component background
- `calendarText`: Calendar text colors
- `shadow`: Shadow colors

## Usage

### In Components

```typescript
import { useTheme } from "@/utils/theme";

function MyComponent() {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.textPrimary }}>Hello World</Text>
    </View>
  );
}
```

### In Style Files

```typescript
import { createMyStyles } from "@/styles/myStyles";

export const createMyStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
    },
    text: {
      color: theme.textPrimary,
    },
  });
```

## Updated Components

The following components and styles have been updated to support dark mode:

### Components

- `InputField`: Input fields with proper background and text colors
- `TaskCell`: Task list items with appropriate surface colors
- `AppButton`: Buttons with theme-aware colors
- `RecordingButton`: Recording interface with dark mode support

### Style Files

- `globalStyles.ts`: Global app styles
- `addNewTaskStyles.ts`: Add task screen styles
- `inputFieldStyles.ts`: Input field styles
- `taskCellStyles.ts`: Task cell styles
- `buttonStyles.ts`: Button styles
- `taskDetailsStyles.ts`: Task details screen styles
- `assistantTabStyles.ts`: Assistant tab styles
- `tableComponentsStyles.ts`: Table component styles

### Screens

- `add-task.tsx`: Add task screen with calendar theming
- `(tabs)/index.tsx`: Assistant tab with full dark mode support

## Testing Dark Mode

To test the dark mode implementation:

1. **iOS**: Go to Settings > Display & Brightness > Appearance and toggle between Light and Dark
2. **Android**: Go to Settings > Display > Theme and select Dark theme
3. **Development**: The app will automatically respond to system changes

## Benefits

1. **User Preference**: Respects user's system preference
2. **Accessibility**: Better contrast ratios for users with visual impairments
3. **Battery Life**: Dark mode can save battery on OLED screens
4. **Modern UX**: Follows current design trends and user expectations

## Future Enhancements

Potential improvements for the dark mode system:

1. **Manual Override**: Allow users to manually override system preference
2. **Custom Themes**: Support for custom color schemes
3. **Animation Transitions**: Smooth transitions between light and dark modes
4. **Accessibility**: Enhanced support for high contrast modes
