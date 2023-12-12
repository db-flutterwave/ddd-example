export class FirstNameError extends Error {
  name: string = 'FirstNameError';
  constructor() {
    super(
      'The first name must be a valid name containing only alphabets with hyphens and spaces in-between.',
    );
  }
}

export class LastNameError extends Error {
  name: string = 'LastNameError';
  constructor() {
    super(
      'The last name must be a valid name containing only alphabets with hyphens and spaces in-between.',
    );
  }
}

export class EmailError extends Error {
  name: string = 'EmailError';
  constructor() {
    super('The email address must be a valid email.');
  }
}

export class PhoneNumberError extends Error {
  name: string = 'PhoneError';
  constructor() {
    super('The phone number is not a recognized phone number type.');
  }
}

export class CountryError extends Error {
  name: string = 'CountryError';
  constructor() {
    super('The selected country is not supported.');
  }
}
