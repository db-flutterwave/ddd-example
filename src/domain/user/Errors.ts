export class UserInfoRequiredError extends Error {
  constructor() {
    super('the user info is required');
  }
}

export class UserRepositoryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class GetProfileError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UpdateProfileError extends Error {
  constructor(message: string) {
    super(message);
  }
}
