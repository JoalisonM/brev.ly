import BaseError, { ErrorType } from "./base-error";

export default class ShortLinkAlreadyExistsError extends BaseError {
  constructor({
    status = 409,
    name = "ShortLinkAlreadyExistsError",
    message,
    type = "short_link_already_existis",
    errors = [],
  }: ErrorType) {
    super({ message });

    this.name = name;
    this.status = status;
    this.type = type;
    this.errors = errors;
  }
}
