//
//  ActionButtonView.swift
//  OrganiserWidget
//
//  Created by Georgy Polonskiy on 23/07/2025.
//

import SwiftUI

/// A reusable element descring the button view for the provided `ActionButtonView`
struct ActionButtonView: View {
    let buttonType: ButtonType
    
    var body: some View {
        BaseButtonView(buttonType: buttonType)
    }
    
    init(_ buttonType: ButtonType) {
        self.buttonType = buttonType
    }
}

/// Extension to add modifier methods
extension ActionButtonView {
    /// Configures the size of the image of the `ActionButtonView`
    func imageSize(_ size: CGFloat) -> some View {
        self.modifier(ButtonImageSizeModifier(size: size))
    }
    
    /// Configures the label display of the `ActionButtonView`
    func showLabel(_ show: Bool) -> some View {
        self.modifier(ButtonLabelVisibilityModifier(showLabel: show))
    }
}

/// An environment key for button image size
private struct ButtonImageSizeKey: EnvironmentKey {
    static let defaultValue: CGFloat = 50
}

/// An environment key for button label display
private struct ShowButtonLabelKey: EnvironmentKey {
    static let defaultValue: Bool = false
}

private extension EnvironmentValues {
    /// A value containing configuration for the button image size of the button view
    var buttonImageSize: CGFloat {
        get { self[ButtonImageSizeKey.self] }
        set { self[ButtonImageSizeKey.self] = newValue }
    }
    
    /// A value containing configuration for the button label display
    var showButtonLabel: Bool {
        get { self[ShowButtonLabelKey.self] }
        set { self[ShowButtonLabelKey.self] = newValue }
    }
}

/// Internal base view that handles the actual button rendering
private struct BaseButtonView: View {
    let buttonType: ButtonType
    
    /// Environment variables containing configuration for button display
    @Environment(\.buttonImageSize) private var imageSize
    @Environment(\.showButtonLabel) private var showLabel
    
    var body: some View {
        Link(destination: buttonType.url) {
            VStack(spacing: 20) {
                Image(systemName: buttonType.icon)
                    .resizable()
                    .foregroundStyle(buttonType.color)
                    .frame(width: imageSize, height: imageSize)
               
                if showLabel {
                    Text(ButtonType.caseDisplayRepresentations[buttonType]?.title ?? "")
                        .font(.caption)
                        .lineLimit(1)
                }
            }
        }
    }
}

/// Custom modifiers
private struct ButtonImageSizeModifier: ViewModifier {
    let size: CGFloat
    
    func body(content: Content) -> some View {
        content.environment(\.buttonImageSize, size)
    }
}

private struct ButtonLabelVisibilityModifier: ViewModifier {
    let showLabel: Bool
    
    func body(content: Content) -> some View {
        content.environment(\.showButtonLabel, showLabel)
    }
}

#Preview {
    ActionButtonView(.addNew)
}
