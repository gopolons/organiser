//
//  TodoIntents.swift
//  OrganiserWidget
//
//  Created by Georgy Polonskiy on 23/07/2025.
//

import WidgetKit
import AppIntents

/// Intent for triggering a task completion action, ticking off the task as done on the widget
struct CompleteTaskIntent: AppIntent {
    static var title: LocalizedStringResource = "Complete Task"
    static var description = IntentDescription("Mark a task as completed")
    
    @Parameter(title: "Task ID")
    var taskId: String
    
    /// Initializer which assigns the task ID to the `taskID` variable of the intent
    init(taskId: String) {
        self.taskId = taskId
    }
    
    /// Required initializer
    init() {}
    
    func perform() async throws -> some IntentResult {
        // Update task in shared storage
        TodoDataStore.shared.completeTask(id: taskId)
        
        // Trigger widget refresh
        WidgetCenter.shared.reloadAllTimelines()
        
        return .result()
    }
}

/// Intent for triggering a redirect to the app where the user can view requested task details
struct OpenTaskDetailsIntent: AppIntent {
    static var title: LocalizedStringResource = "Open Task Details"
    static var description = IntentDescription("Opens the task details page in the app")
  
    @Parameter(title: "Task ID")
    var taskId: String
    
    /// Initializer which assigns the task ID to the `taskID` variable of the intent
    init(taskId: String) {
        self.taskId = taskId
    }
    
    /// Required initializer
    init() {}
    
    func perform() async throws -> some IntentResult {
        // Get the URL to link into the app
        guard let url = URL(string: "organiser://task-details?id=\(taskId)") else { throw AppIntentError.Unrecoverable.notAllowed }
        return .result(opensIntent: OpenURLIntent(url))
    }
}
