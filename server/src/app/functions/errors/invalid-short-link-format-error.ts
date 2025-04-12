export class InvalidShortLinkFormatError extends Error {
  constructor() {
    super("Invalid short link format");
  }
}
