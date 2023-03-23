export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serializeErrors(): { message: string; field?: string }[];

  constructor(message: string) {
    super(message);

    // Only has to be done if we are extending a class that is built in to the language
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
