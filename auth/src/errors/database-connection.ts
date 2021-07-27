import { CustomError } from "./custom-error";

const reason = "Error connecting to database";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = reason;

  constructor() {
    super(reason);

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
