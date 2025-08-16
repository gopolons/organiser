//
//  TodoTask.swift
//  OrganiserWidget
//
//  Created by Georgy Polonskiy on 23/07/2025.
//

import Foundation

/// A model for the task data structure which will be parsed from the React Native app
struct TodoTask: Identifiable, Codable {
    let id: String
    var name: String
    let description: String
    let dueDate: TimeInterval
    var completed: Bool
    var tags: [String]
}
