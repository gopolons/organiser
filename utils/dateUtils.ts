import dayjs from "dayjs";

// Function which returns true if the timestamp is now today or in the future
export function isOverdue(timestamp: number): boolean {
  const date = dayjs(timestamp);
  return date.isBefore(dayjs(), "day") && !date.isToday();
}

// Function for converting unix timestamp into a YYYY-MM-DD format
export function convertToISO8601(timestamp: number, format?: string): string {
  return dayjs(timestamp).format(format || "YYYY-MM-DD");
}

// Function for converting ISO8601 string to unix timestamp
export function convertFromISO8601(dateString: string): number {
  return dayjs(dateString).valueOf();
}
