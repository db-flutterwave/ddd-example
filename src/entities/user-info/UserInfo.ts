import * as Rules from '../../commons/utils/rules';
import {
  CountryError,
  EmailError,
  FirstNameError,
  LastNameError,
  PhoneNumberError,
} from './Errors';
import {SupportedCountries} from '../../commons/data/supported-countries';
import {CountryCode} from 'libphonenumber-js';

export type NewUserInfoInput = {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  country: CountryCode;
};

export class UserInfo {
  private id: number;
  private firstName: string;
  private lastName: string;
  private emailAddress: string;
  private phoneNumber: string;
  private country: CountryCode;

  /**
   * @param input object
   * @throws Error
   */
  constructor(input: NewUserInfoInput) {
    if (!Rules.IsHumanName(input.firstName)) {
      throw new FirstNameError();
    }
    if (!Rules.IsHumanName(input.lastName)) {
      throw new LastNameError();
    }
    if (!Rules.IsEmailAddress(input.emailAddress)) {
      throw new EmailError();
    }
    if (!Rules.IsPhoneNumber(input.phoneNumber)) {
      throw new PhoneNumberError();
    }
    if (!SupportedCountries.includes(input.country)) {
      throw new CountryError();
    }
    this.id = input.id;
    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.emailAddress = input.emailAddress;
    this.phoneNumber = input.phoneNumber;
    this.country = input.country;
  }

  ID(): number {
    return this.id;
  }

  FirstName(): string {
    return this.firstName;
  }

  LastName(): string {
    return this.lastName;
  }

  FullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  EmailAddress(): string {
    return this.emailAddress;
  }

  PhoneNumber(): string {
    return this.phoneNumber;
  }

  Country(): CountryCode {
    return this.country;
  }

  /**
   * @param input string
   * @throws FirstNameError
   */
  SetFirstName(input: string) {
    if (!Rules.IsHumanName(input)) {
      throw new FirstNameError();
    }
    this.firstName = input;
  }

  /**
   * @param input string
   * @throws LastNameError
   */
  SetLastName(input: string) {
    if (!Rules.IsHumanName(input)) {
      throw new LastNameError();
    }
    this.lastName = input;
  }

  /**
   * @param input string
   * @throws LastNameError
   */
  SetPhoneNumber(input: string) {
    if (!Rules.IsPhoneNumber(input)) {
      throw new PhoneNumberError();
    }
    this.phoneNumber = input;
  }
}
