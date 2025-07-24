//
//  OrganiserWidgetBundle.swift
//  OrganiserWidget
//
//  Created by Georgy Polonskiy on 22/07/2025.
//

import WidgetKit
import SwiftUI

@main
struct TestWidgetBundle: WidgetBundle {
    var body: some Widget {
        SimpleButtonsWidget()
        TodoListWidget()
    }
}
