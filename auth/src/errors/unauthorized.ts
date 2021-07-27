import { CustomError } from "./custom-error";

const message = "Unauthorized";

export class Unauthorized extends CustomError {
  statusCode = 401;

  constructor() {
    super(message);

    Object.setPrototypeOf(this, Unauthorized.prototype);
  }

  serializeErrors() {
    return [{ message }];
  }
}
