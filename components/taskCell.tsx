import { TaskData } from "@/model/task";
import { taskCellStyles as styles } from "@/styles/taskCellStyles";
import { isOverdue } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

// Cell data
type Props = {
  task: TaskData;
  toggleCompletionStatus: () => void;
  showTaskDetails: () => void;
};

// A cell displaying task data
export const TaskCell = ({
  task,
  toggleCompletionStatus,
  showTaskDetails,
}: Props) => {
  const formatDueDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        task.completed && styles.completedContainer,
        isOverdue(task.dueDate) && styles.overdueContainer,
      ]}
      onPress={() => showTaskDetails()}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text
              style={[styles.title, task.completed && styles.completedTitle]}
            >
              {task.name}
            </Text>
            {isOverdue(task.dueDate) && !task.completed && (
              <View style={styles.overdueBadge}>
                <Text style={styles.overdueText}>Overdue</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[styles.checkbox, task.completed && styles.checkedBox]}
            onPress={() => toggleCompletionStatus()}
          >
            {task.completed && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {task.description && (
          <Text
            style={[
              styles.description,
              task.completed && styles.completedDescription,
            ]}
          >
            {task.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={task.completed ? "#9CA3AF" : "#6B7280"}
            />
            <Text
              style={[
                styles.dateText,
                task.completed && styles.completedDateText,
              ]}
            >
              Due: {formatDueDate(task.dueDate)}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.statusText,
                task.completed ? styles.completedStatus : styles.pendingStatus,
              ]}
            >
              {task.completed ? "Completed" : "Pending"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
