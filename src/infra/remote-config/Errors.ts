export class GetError extends Error {
  constructor() {
    super('Data unavailable. Please try again in a moment.');
  }
}

export class GetOAuthConfigError extends Error {
  constructor(message: string) {
    super(message);
  }
}
