import BaseError, { ErrorType } from "./base-error";

export default class ResourceNotFoundError extends BaseError {
  constructor({
    status = 404,
    name = "ResourceNotFoundError",
    message,
    type = "resource_not_found",
    errors = [],
  }: ErrorType) {
    super({ message });

    this.name = name;
    this.status = status;
    this.type = type;
    this.errors = errors;
  }
}
