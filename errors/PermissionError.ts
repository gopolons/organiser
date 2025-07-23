// An error which will be thrown when permissions are not granted correctly
export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}
