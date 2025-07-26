//
//  SimpleButtonsWidget.swift
//  OrganiserWidget
//
//  Created by Georgy Polonskiy on 22/07/2025.
//

import WidgetKit
import SwiftUI
import AppIntents

/// Simple widget view displaying static buttons to the user, allowing them to go to different parts of the app
struct SimpleButtonsWidgetView: View {
    var entry: SimpleButtonsProvider.Entry
    
    /// A property for accessing current widget size family
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            smallWidgetView
        case .systemMedium:
            mediumWidgetView
        default:
            smallWidgetView
        }
    }
}

extension SimpleButtonsWidgetView {
    /// A reusable element descring the button view for the provided `ButtonType`
    private func buttonView(for buttonType: ButtonType) -> some View {
        ActionButtonView(buttonType)
            .showLabel(true)
            .frame(maxWidth: .infinity)
    }
    
    /// A view component describing the small widget view size
    private var smallWidgetView: some View {
        HStack {
            buttonView(for: entry.configuration.firstButton)
            buttonView(for: entry.configuration.secondButton)
        }
    }
    
    /// A view component describing the medium widget view size
    private var mediumWidgetView: some View {
        HStack {
            buttonView(for: entry.configuration.firstButton)
            buttonView(for: entry.configuration.secondButton)
            buttonView(for: entry.configuration.thirdButton)
            buttonView(for: entry.configuration.fourthButton)
        }
    }
}

/// Simple buttons widget providing user with some static actions to navigate to different parts of the app
struct SimpleButtonsWidget: Widget {
    let kind: String = "Simple Buttons Widget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(
            kind: kind,
            intent: SimpleButtonsConfigurationIntent.self,
            provider: SimpleButtonsProvider()
        ) { entry in
            SimpleButtonsWidgetView(entry: entry)
                .containerBackground(.background, for: .widget)
                .dynamicTypeSize(.medium)
        }
        .configurationDisplayName("To Do Actions")
        .description("Quick access to your todo list actions - only first and second buttons available on small size")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

#Preview(as: .systemSmall) {
    SimpleButtonsWidget()
} timeline: {
    SimpleButtonsEntry(date: .now, configuration: .init())
}

#Preview(as: .systemMedium) {
    SimpleButtonsWidget()
} timeline: {
    SimpleButtonsEntry(date: .now, configuration: .init())
}
