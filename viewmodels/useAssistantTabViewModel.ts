import { PermissionError } from "@/errors/PermissionError";
import { TaskData } from "@/model/task";
import { AIService } from "@/services/openai";
import { TaskPersistence } from "@/services/persistence";
import { RecordingService } from "@/services/recording";
import { convertFromISO8601 } from "@/utils/dateUtils";
import { cleanupAudioFile } from "@/utils/fileSystemUtils";
import { randomUUID } from "expo-crypto";
import { useState } from "react";

// View model for Assistant Tab Bar View
export default function useAssistantTabViewModel(
  recordingService: RecordingService,
  aiService: AIService,
  persistence: TaskPersistence
) {
  // Declare loading state variables
  const [loading, setLoading] = useState(false);
  // Declare recording service variables
  const { record, stopRecording, recorderState } = recordingService;
  // Declare AI service variables
  const { transcribeAudio, processTextInput } = aiService;

  // Function for initiating recording
  const startRecording = async () => {
    try {
      const result = await record();
    } catch (error) {
      if (error instanceof PermissionError) {
        return {
          permissionError: error.message,
        };
      } else {
        return {
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }
  };

  // Function for stopping the recording and processing the output
  const processRecording = async () => {
    // Finish the recording and get the URI of the recording
    const uri = await stopRecording();

    // Update state
    setLoading(true);

    // Check that URI exists
    if (!uri) {
      return {
        success: false,
        error: "Error fetching URI from recording",
      };
    }

    try {
      // Transcribe audio via the AI service
      const transcribeResponse = await transcribeAudio(uri);
      const transcribedText = transcribeResponse.data;
      // Process transcribed audio input
      const response = await processTextInput(transcribedText);

      const parsedData = JSON.parse(response.data);

      const parsedTasks = parsedData.tasks.map((task: any) => ({
        id: randomUUID(),
        name: task.name || "Untitled Task",
        description: task.description || "",
        dueDate: convertFromISO8601(task.dueDate),
        completed: false,
      }));

      return {
        success: true,
        data: parsedTasks,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      // Clean up the audio file
      await cleanupAudioFile(uri);
      setLoading(false);
    }
  };

  // A function for cancelling an active recording
  const cancelRecording = async () => {
    // Finish the recording and clean up
    const uri = await stopRecording();
    if (uri) {
      await cleanupAudioFile(uri);
    }
  };

  // A function for storing a given task in persistence
  const saveTaskInPersistence = async (task: TaskData) => {
    try {
      await persistence.addTask(task);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }

    return { success: true };
  };

  return {
    startRecording,
    processRecording,
    cancelRecording,
    saveTaskInPersistence,
    recorderState,
    loading,
  };
}
