//
//  StaticButtonsConfiguration.swift
//  OrganiserWidget
//
//  Created by Georgy Polonskiy on 22/07/2025.
//

import AppIntents
import WidgetKit

/// A configuration intent for the `SimpleButtonsWidget` allowing the user to define which buttons they would like to be displayed on their widget
struct SimpleButtonsConfigurationIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource = "Choose Buttons"
    static var description = IntentDescription("Select which buttons to display in your widget")
    
    @Parameter(title: "First Button", default: .addNew)
    var firstButton: ButtonType
    
    @Parameter(title: "Second Button", default: .mic)
    var secondButton: ButtonType

    @Parameter(title: "Third Button", default: .todo)
    var thirdButton: ButtonType
    
    @Parameter(title: "Fourth Button", default: .completed)
    var fourthButton: ButtonType
}

/// A configuration for the `SimpleButtonsWidget` which accepts configuration parameter
struct SimpleButtonsEntry: TimelineEntry {
    let date: Date
    let configuration: SimpleButtonsConfigurationIntent
}

/// A Timeline Provider for the `SimpleButtonsWidget`, which fetches the data and packages it into `SimpleButtonsEntry` object
struct SimpleButtonsProvider: AppIntentTimelineProvider {
    /// Function returning a placeholder entry
    func placeholder(in context: Context) -> SimpleButtonsEntry {
        SimpleButtonsEntry(
            date: .now,
            configuration: .init()
        )
    }
    
    /// A function returning a snapshot entry, describing the entry at the current moment in time
    func snapshot(for configuration: SimpleButtonsConfigurationIntent, in context: Context) async -> SimpleButtonsEntry {
        SimpleButtonsEntry(date: .now, configuration: configuration)
    }
    
    /// A function returning an array of timeline entries for the current time as well as future times to update the widget
    func timeline(for configuration: SimpleButtonsConfigurationIntent, in context: Context) async -> Timeline<SimpleButtonsEntry> {
        let entry = SimpleButtonsEntry(date: Date(), configuration: configuration)
        return Timeline(entries: [entry], policy: .never)
    }
}
