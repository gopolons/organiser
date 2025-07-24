//
//  TimeInterval+Extensions.swift
//  OrganiserWidget
//
//  Created by Georgy Polonskiy on 23/07/2025.
//

import Foundation

extension TimeInterval {
    /// Check if a timestamp is before today's start
    func isBeforeToday() -> Bool {
        // Get the start of today (midnight) in user's local timezone
        var calendar = Calendar.current
        calendar.timeZone = TimeZone.current
        let startOfToday = calendar.startOfDay(for: Date())
        
        // Convert Unix timestamp to Date
        let taskDueDate = Date(timeIntervalSince1970: self)
        
        return taskDueDate < startOfToday
    }
    
    /// Check if a timestamp is for today or earlier (not future dates)
    func isTodayOrEarlier() -> Bool {
        // Get the start of tomorrow (midnight of next day) in user's local timezone
        var calendar = Calendar.current
        calendar.timeZone = TimeZone.current
        let startOfTomorrow = calendar.date(byAdding: .day, value: 1, to: calendar.startOfDay(for: Date()))!
        
        // Convert Unix timestamp to Date
        let taskDueDate = Date(timeIntervalSince1970: self)
        
        return taskDueDate < startOfTomorrow
    }
    
    /// Converts TimeInterval to a readable date format like "21 Jul" or "3 Jun"
    func toReadableDate() -> String {
        let date = Date(timeIntervalSince1970: self)
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMM"
        return formatter.string(from: date)
    }
}
