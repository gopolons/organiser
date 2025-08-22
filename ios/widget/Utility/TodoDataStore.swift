//
//  TodoDataStore.swift
//  OrganiserWidget
//
//  Created by Georgy Polonskiy on 23/07/2025.
//

import Foundation

/// A key for requests to User Defaults
private let userDefaultsKey = "tasks"

/// A structure which will be passed to `TodoDataStore.getTasks` specifying the options for data fetch operation
struct DataStoreRequestOptions {
    /// Determines if the overdue tasks are to be included
    var includeOverdue: Bool = true
    /// Determines the amount of data fetched from the data store
    var maxCount: Int = 10
}

/// A class for accessing the shared data store between the app and widget
class TodoDataStore: ObservableObject {
    /// Shared property
    static let shared = TodoDataStore()
    /// The reference to user defaults property which will store the data between the app and widget
    private let userDefaults: UserDefaults
    
    /// Private initializer assigning the user defaults property
    private init() {
        // FIXME: FIX WHEN EMBEDDING INTO THE APP
        userDefaults = UserDefaults(suiteName: "group.com.georgiipolonskii.organiser.shared") ?? .standard
    }
    
    /// Function for fetching tasks from UserDefaults
    func getTasks(options: DataStoreRequestOptions = DataStoreRequestOptions()) -> [TodoTask] {
        guard let data = userDefaults.data(forKey: userDefaultsKey),
              let allTasks = try? JSONDecoder().decode([TodoTask].self, from: data) else {
            // Return empty array if fetch fails
            return []
        }
        
        var filteredTasks = allTasks
        
        // Filter to only show incompleted tasks
        filteredTasks = filteredTasks.filter { !$0.completed }
        
        // Filter to only show tasks for today or earlier (no future tasks)
        filteredTasks = filteredTasks.filter { $0.dueDate.isTodayOrEarlier() }
        
        // Filter overdue tasks if necessary
        if !options.includeOverdue {
            filteredTasks = filteredTasks.filter { !$0.dueDate.isBeforeToday() }
        }
        
        // Sort by date, so outdated tasks come first
        filteredTasks = filteredTasks.sorted(by: { $0.dueDate < $1.dueDate })
      
        // Sort by order
        filteredTasks = filteredTasks.sorted(by: { $0.order < $1.order })
        
        return Array(filteredTasks.prefix(options.maxCount))
    }
    
    /// Function for marking the task as complete in UserDefaults
    func completeTask(id: String) {
        guard let data = userDefaults.data(forKey: userDefaultsKey),
              var tasks = try? JSONDecoder().decode([TodoTask].self, from: data) else {
            return
        }
        
        // Find the index of the task and mark it as complete in the array
        if let index = tasks.firstIndex(where: { $0.id == id }) {
            tasks[index].completed = true
            
            // Store the updated array in UserDefaults
            if let encoded = try? JSONEncoder().encode(tasks) {
                userDefaults.set(encoded, forKey: userDefaultsKey)
            }
        }
    }
}

/// A variable holding some sample tasks for testing purposes
var sampleTasks: [TodoTask] = [
    TodoTask(
        id: "task_001",
        name: "Submit quarterly report",
        description: "Complete and submit Q2 financial report to management",
        dueDate: 1752998400, // July 20, 2025
        completed: false,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_002",
        name: "Doctor appointment",
        description: "Annual checkup with Dr. Smith at 2:00 PM",
        dueDate: 1753660800, // July 28, 2025
        completed: false,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_003",
        name: "Grocery shopping",
        description: "Buy ingredients for weekend dinner party - milk, eggs, bread, vegetables",
        dueDate: 1753238400, // July 23, 2025
        completed: false,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_004",
        name: "Call mom",
        description: "Weekly check-in call with mom to catch up",
        dueDate: 1753238400,
        completed: true,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_005",
        name: "Review project proposal",
        description: "Review and provide feedback on the new mobile app project proposal from the development team",
        dueDate: 1753238400,
        completed: false,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_006",
        name: "Pay electricity bill",
        description: "Monthly electricity bill payment due - $147.50",
        dueDate: 1753104000, // July 21, 2025
        completed: false,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_007",
        name: "Team standup meeting",
        description: "Weekly team standup at 9:00 AM to discuss project progress",
        dueDate: 1753507200, // July 26, 2025
        completed: false,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_008",
        name: "Water plants",
        description: "Water all indoor plants and check soil moisture levels",
        dueDate: 1753238400,
        completed: false,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_009",
        name: "Book vacation flights",
        description: "Research and book flights for August vacation to Italy",
        dueDate: 1753833600, // July 30, 2025
        completed: false,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_010",
        name: "Finish reading chapter 5",
        description: "Complete reading chapter 5 of 'The Swift Programming Language' book",
        dueDate: 1753238400,
        completed: true,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_011",
        name: "Return library books",
        description: "Return 3 overdue books to the city library - $15 late fee pending",
        dueDate: 1752912000, // July 19, 2025
        completed: false,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_012",
        name: "Dentist cleaning",
        description: "6-month dental cleaning appointment at 3:30 PM with Dr. Johnson",
        dueDate: 1753420800, // July 25, 2025
        completed: false,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_013",
        name: "Update resume",
        description: "Add recent project experience and update skills section",
        dueDate: 1753238400,
        completed: false,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_014",
        name: "Submit expense report",
        description: "Compile and submit monthly business expense report for July",
        dueDate: 1753747200, // July 29, 2025
        completed: false,
        tags: [],
        order: 0
    ),
    
    TodoTask(
        id: "task_015",
        name: "Backup computer files",
        description: "Run weekly backup of important documents and photos to external drive",
        dueDate: 1753238400,
        completed: true,
        tags: [],
        order: 0
    )
]
