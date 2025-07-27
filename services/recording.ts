import { PermissionError } from "@/errors/PermissionError";
import {
  AudioModule,
  RecorderState,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

export interface RecordingService {
  record(): Promise<void>;
  stopRecording(): Promise<string | null>;
  recorderState: RecorderState;
}

export function RecordingServiceImplementation(): RecordingService {
  // Declare audio recorder
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  // Variable for tracking recording state
  const recorderState = useAudioRecorderState(audioRecorder);

  // Function for checking audio recording permissions
  async function checkPermission() {
    const status = await AudioModule.requestRecordingPermissionsAsync();

    if (!status.granted) {
      throw new PermissionError(
        "Permission to access microphone was denied. Please update microphone permissions in settings and try again."
      );
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });
  }

  // Function for starting recording
  const record = async () => {
    await checkPermission();
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  // Function for stopping recording and returning URI of the recorded file
  const stopRecording = async () => {
    await audioRecorder.stop();
    return audioRecorder.uri;
  };

  return { record, stopRecording, recorderState };
}
