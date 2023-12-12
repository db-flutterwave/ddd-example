import {CountryCode} from 'libphonenumber-js';
import {UserInfoRequiredError} from './Errors';
import {UserInfo} from '../../entities/user-info/UserInfo';
import {Verification} from '../../valueobjects/verification/Verification';

export type NewUserInput = {
  userInfo?: UserInfo;
  verification?: Verification;
};

class User {
  private userInfo: UserInfo;
  private verification: Verification;

  constructor(input: NewUserInput) {
    if (!input.userInfo) {
      throw new UserInfoRequiredError();
    }
    if (!input.verification) {
      throw new Error('verification is required');
    }
    this.userInfo = input.userInfo;
    this.verification = input.verification;
  }

  ID(): number {
    return this.userInfo.ID();
  }

  FirstName(): string {
    return this.userInfo.FirstName();
  }

  LastName(): string {
    return this.userInfo.LastName();
  }

  FullName(): string {
    return this.userInfo.FullName();
  }

  EmailAddress(): string {
    return this.userInfo.EmailAddress();
  }

  PhoneNumber(): string {
    return this.userInfo.PhoneNumber();
  }

  Country(): CountryCode {
    return this.userInfo.Country();
  }

  IsVerified(): boolean {
    return this.verification.Status() === 'completed';
  }

  /**
   * @param input string
   * @returns void
   * @throws entities.user.FirstNameError
   */
  SetFirstName(input: string) {
    if (this.verification.Status() !== 'completed') {
      throw new Error('verification not complete');
    }
    return this.userInfo.SetFirstName(input);
  }

  /**
   * @param input string
   * @returns void
   * @throws entities.user.LastNameError
   */
  SetLastName(input: string) {
    if (this.verification.Status() !== 'completed') {
      throw new Error('verification not complete');
    }
    return this.userInfo.SetLastName(input);
  }

  /**
   * @param input string
   * @returns void
   * @throws entities.user.PhoneNumberError
   */
  SetPhoneNumber(input: string) {
    return this.userInfo.SetPhoneNumber(input);
  }
}

export default User;
