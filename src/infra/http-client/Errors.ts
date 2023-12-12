export class BaseURLRequiredError extends Error {
  constructor() {
    super('Base url is required to initialize.');
  }
}

export class HttpTrackerRequiredError extends Error {
  constructor() {
    super('Http tracker is required to initialize.');
  }
}
