import { buttonStyles, recordingButtonStyles } from "@/styles/buttonStyles";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

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

// Recording button component with beautiful animations
type RecordingButtonProps = {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  disabled?: boolean;
};

export const RecordingButton = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  disabled = false,
}: RecordingButtonProps) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation when recording
  useEffect(() => {
    if (isRecording) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  const handlePress = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <View style={recordingButtonStyles.container}>
      {/* Main recording button */}
      <Animated.View
        style={{
          transform: [{ scale: isRecording ? pulseAnim : scaleAnim }],
        }}
      >
        <TouchableOpacity
          style={[
            recordingButtonStyles.mainButton,
            isRecording
              ? recordingButtonStyles.mainButtonRecording
              : recordingButtonStyles.mainButtonIdle,
          ]}
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={32}
            color="white"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Cancel button - only visible when recording */}
      {isRecording && (
        <TouchableOpacity
          style={recordingButtonStyles.cancelButton}
          onPress={onCancelRecording}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <Ionicons
            name="close"
            size={16}
            color="white"
            style={recordingButtonStyles.cancelButtonIcon}
          />
          <Text style={recordingButtonStyles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <View style={recordingButtonStyles.recordingIndicator}>
          <View style={recordingButtonStyles.recordingDot} />
          <Text style={recordingButtonStyles.recordingText}>Recording...</Text>
        </View>
      )}

      {/* Instructions */}
      {!isRecording && (
        <Text style={recordingButtonStyles.instructions}>
          Tap to start recording{"\n"}
          <Text style={recordingButtonStyles.instructionsSubtext}>
            Tap stop to process • Tap cancel to discard
          </Text>
        </Text>
      )}
    </View>
  );
};
