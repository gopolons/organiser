//
//  TodoListCell.swift
//  OrganiserWidget
//
//  Created by Georgy Polonskiy on 23/07/2025.
//

import SwiftUI

/// A cell for the to do list containing the button and logic for marking it as done or opening in app
struct TodoListCell: View {
    let task: TodoTask
    
    var body: some View {
        HStack {
            Button(intent: CompleteTaskIntent(taskId: task.id)) {
                Image(systemName: "circle")
                    .foregroundStyle(.gray)
            }
            .buttonStyle(.plain)

            Link(destination: URL(string: "organiser://task-details?taskID=\(task.id)")!) {
                Text(task.name)
                    .font(.subheadline)
                    .lineLimit(1)
                    .truncationMode(.tail)
                
                Spacer(minLength: 0)
                
                if task.dueDate.isBeforeToday() {
                    Text(task.dueDate.toReadableDate())
                        .font(.subheadline)
                        .foregroundStyle(.red)
                }
            }
        }
    }
}
