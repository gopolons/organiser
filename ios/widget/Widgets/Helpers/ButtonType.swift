//
//  ButtonType.swift
//  OrganiserWidget
//
//  Created by Georgy Polonskiy on 22/07/2025.
//

import SwiftUI
import WidgetKit
import AppIntents

/// A type describing available button types to displayed on the `SimpleButtonWidget`
enum ButtonType: String, CaseIterable, AppEnum {
    case addNew = "addNew"
    case mic = "mic"
    case todo = "todo"
    case completed = "completed"
    
    /// A property describing the label on the button selection option
    static var typeDisplayRepresentation: TypeDisplayRepresentation = "Button Type"
    
    /// A property describing the names of the buttons available to user for selection
    static var caseDisplayRepresentations: [ButtonType : DisplayRepresentation] = [
        .addNew: "Add New",
        .mic: "Assistant",
        .todo: "To Do List",
        .completed: "Done List"
    ]
    
    /// Buttons icon property which contains `SFSymbols` name of the button image
    var icon: String {
        switch self {
        case .addNew: return "plus.circle.fill"
        case .mic: return "mic.circle.fill"
        case .todo: return "clock.fill"
        case .completed: return "checkmark.circle.fill"
        }
    }
    
    /// Button color property which contains `Color` of the button
    var color: Color {
        switch self {
        case .addNew: return .blue
        case .mic: return .red
        case .todo: return .orange
        case .completed: return .green
        }
    }

    /// URL associated with the button
    var url: URL {
        switch self {
        case .addNew:  URL(string: "organiser://add-task")!
        case .mic: URL(string: "organiser://(tabs)/")!
        case .todo: URL(string: "organiser://(tabs)/todo")!
        case .completed: URL(string: "organiser://(tabs)/completed")!
        }
    }
}
