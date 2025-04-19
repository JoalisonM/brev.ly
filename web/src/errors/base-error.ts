export interface ErrorType {
  status?: number;
  name?: string;
  type?: string;
  message?: any;
  errors?: any[];
  stack?: string;
}

export default class BaseError extends Error {
  status: number;
  type: string;
  errors: any[];

  constructor({
    status = 500,
    name = "BaseError",
    message,
    type = "base_error",
    errors = [],
    stack = "",
  }: ErrorType) {
    super(message);

    this.stack = stack;
    this.name = name;
    this.status = status;
    this.type = type;
    this.errors = errors;
  }
}
