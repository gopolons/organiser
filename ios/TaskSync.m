//
//  TaskSync.m
//  Organiser
//
//  Created by Georgy Polonskiy on 24/07/2025.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TaskSync, NSObject)

RCT_EXTERN_METHOD(syncTasksToWidget:(NSString *)tasks)
RCT_EXTERN_METHOD(getTasksFromWidget:(RCTResponseSenderBlock)callback)

@end
