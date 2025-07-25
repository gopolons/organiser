//
//  TaskSync.swift
//  Organiser
//
//  Created by Georgy Polonskiy on 24/07/2025.
//

import Foundation
import React

/// Native module for writing to UserDefaults from React Native
@objc(TaskSync)
class TaskSync: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  /// Function for writing the tasks to User Defaults
  @objc
  func syncTasksToWidget(_ tasks: String) {
    let userDefaults = UserDefaults(suiteName: "group.com.georgiipolonskii.organiser.shared") ?? .standard
    
    if let data = tasks.data(using: .utf8) {
      userDefaults.set(data, forKey: "tasks")
    }
  }
  
  /// Function for fetching the tasks from User Defaults
  @objc
  func getTasksFromWidget(_ callback: @escaping RCTResponseSenderBlock) {
    let userDefaults = UserDefaults(suiteName: "group.com.georgiipolonskii.organiser.shared") ?? .standard
    
    guard let data = userDefaults.data(forKey: "tasks"),
          let tasks = try? JSONDecoder().decode([TodoTask].self, from: data) else {
      callback([NSNull(), "[]"]) // Return empty array if no data
      return
    }
    
    // Convert back to JSON string
    if let encoded = try? JSONEncoder().encode(tasks),
       let jsonString = String(data: encoded, encoding: .utf8) {
      callback([NSNull(), jsonString])
    } else {
      callback(["Failed to encode tasks", NSNull()])
    }
  }
}
