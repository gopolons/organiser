//
//  TodoWidgetView.swift
//  OrganiserWidget
//
//  Created by Georgy Polonskiy on 23/07/2025.
//

import SwiftUI
import WidgetKit

/// A widget view displaying upcoming user tasks as well as providing ability interact with them. Includes configurable buttons.
struct TodoListWidgetView: View {
    var entry: TodoListTimelineProvider.Entry
    
    /// A property for accessing current widget size family
    @Environment(\.widgetFamily) var family
    
    var body: some View {
        if entry.tasks.isEmpty {
          noTasksRemainingPlaceholder
        } else {
          toDoListView
        }
    }
    
    /// A variable defining the maximum number of tasks displayed on the widget depending on the family size
    private var maxTasks: Int {
        switch family {
        case .systemMedium: 3
        case .systemLarge: 8
        default: 3
        }
    }
}

extension TodoListWidgetView {
    /// A placeholder which will be displayed if there are no remaining tasks
    private var noTasksRemainingPlaceholder: some View {
        ZStack {
            buttonsStack
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
            
            VStack(spacing: 15) {
                Image(systemName: "checkmark.circle.fill")
                    .resizable()
                    .font(.title2)
                    .foregroundColor(.green)
                    .frame(width: 30, height: 30)
                Text("No tasks remaining!")
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
    
    /// A component describing the todo list view
    private var toDoListView: some View {
        VStack {
            widgetHeader
            
            VStack {
                ForEach(Array(entry.tasks.prefix(maxTasks).enumerated()), id: \.element.id) { index, task in
                    TodoListCell(task: task)
                    
                    // Only show divider if it is not the last item
                    if index < entry.tasks.prefix(maxTasks).count - 1 {
                        Divider()
                    }
                }
            }
            .frame(maxHeight: .infinity, alignment: .top)
        }
    }
    
    /// A component describing the header of the widget
    private var widgetHeader: some View {
        HStack {
            remainingTasksLabel
            
            Spacer(minLength: 0)
            
            buttonsStack
        }
    }
    
    /// A component describing the remaining tasks label in header
    private var remainingTasksLabel: some View {
        HStack {
            Text("Tasks for today:")
                .bold()
            
            Text(String(entry.tasks.count))
        }
        .font(.headline)
    }
    
    /// A component describing the buttons component on top of the todo list
    private var buttonsStack: some View {
        HStack {
            if entry.configuration.showAssistantButton {
                ActionButtonView(.mic)
                    .imageSize(25)
            }
            
            if entry.configuration.showAddNewButton {
                ActionButtonView(.addNew)
                    .imageSize(25)
            }
        }
    }
}

/// A widget displaying upcoming user tasks as well as providing ability interact with them. Includes configurable buttons.
struct TodoListWidget: Widget {
    let kind: String = "To Do List Widget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(
            kind: kind,
            intent: TodoListConfigurationIntent.self,
            provider: TodoListTimelineProvider()
        ) { entry in
            TodoListWidgetView(entry: entry)
                .containerBackground(.background, for: .widget)
                .dynamicTypeSize(.medium)
        }
        .configurationDisplayName("To Do List")
        .description("Quick access to your todo list - view tasks, and get quick access to adding new ones.")
        .supportedFamilies([.systemMedium, .systemLarge])
    }
}

#Preview(as: .systemMedium) {
    TodoListWidget()
} timeline: {
    TodoListEntry(date: .now, tasks: Array(sampleTasks.prefix(1)), configuration: .init())
}

#Preview(as: .systemLarge) {
    TodoListWidget()
} timeline: {
    TodoListEntry(date: .now, tasks: Array(sampleTasks.prefix(10)), configuration: .init())
}
