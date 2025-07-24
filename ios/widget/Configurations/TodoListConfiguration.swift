//
//  TodoListConfiguration.swift
//  OrganiserWidget
//
//  Created by Georgy Polonskiy on 23/07/2025.
//

import AppIntents
import WidgetKit

/// A configuration intent for `TodoListWidget`, allowing the user to configure available views on the widget
struct TodoListConfigurationIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource = "To Do Widget Configuration"
    static var description = IntentDescription("Configure your to do widget display")
    
    @Parameter(title: "Show Assistant Button", default: true)
    var showAssistantButton: Bool
    
    @Parameter(title: "Show Add New Button", default: true)
    var showAddNewButton: Bool
    
    @Parameter(title: "Show Overdue", default: true)
    var showOverdue: Bool
}

/// An entry for `TodoListWidget` containing tasks & configuration
struct TodoListEntry: TimelineEntry {
    let date: Date
    let tasks: [TodoTask]
    let configuration: TodoListConfigurationIntent
}

/// A Timeline Provider for the `TodoListWidget`, which fetches the data and packages it into `TodoEntry` object
struct TodoListTimelineProvider: AppIntentTimelineProvider {
    /// Function returning a placeholder entry
    func placeholder(in context: Context) -> TodoListEntry {
        TodoListEntry(date: Date(), tasks: [], configuration: .init())
    }
    
    /// A function returning a snapshot entry, describing the entry at the current moment in time
    func snapshot(for configuration: TodoListConfigurationIntent, in context: Context) async -> TodoListEntry {
        let tasks = TodoDataStore.shared.getTasks(
            options: .init(
                includeOverdue: configuration.showOverdue,
                // FIXME: HARDCODED VALUE FOR NOW, SEE IF IT WILL REQUIRE UPDATING LATER
                maxCount: 10
            )
        )
        
        return TodoListEntry(date: .now, tasks: tasks, configuration: configuration)
    }
    
    /// A function returning an array of timeline entries for the current time as well as future times to update the widget
    func timeline(for configuration: TodoListConfigurationIntent, in context: Context) async -> Timeline<TodoListEntry> {
        let tasks = TodoDataStore.shared.getTasks(
            options: .init(
                includeOverdue: configuration.showOverdue,
                // FIXME: HARDCODED VALUE FOR NOW, SEE IF IT WILL REQUIRE UPDATING LATER
                maxCount: 10
            )
        )
        
        let entry = TodoListEntry(date: .now, tasks: tasks, configuration: configuration)
        
        // Update every 15 mins
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: .now) ?? .now
        return Timeline(entries: [entry], policy: .after(nextUpdate))
    }
}
