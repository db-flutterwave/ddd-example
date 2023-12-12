import {
  CountryError,
  EmailError,
  FirstNameError,
  LastNameError,
  PhoneNumberError,
} from './Errors';
import {NewUserInfoInput, UserInfo} from './UserInfo';

describe('entities.User', () => {
  describe('NewUser', () => {
    type TestCase = {
      name: string;
      input: NewUserInfoInput;
      expectedError: Error | null;
    };
    const testCases: TestCase[] = [
      {
        name: 'throws if first name is invalid',
        input: {
          country: 'US',
          emailAddress: 'jd@email.com',
          id: 0,
          firstName: 'Jon ',
          lastName: 'Doe',
          phoneNumber: '09000000000',
        },
        expectedError: new FirstNameError(),
      },
      {
        name: 'throws if last name is invalid',
        input: {
          country: 'US',
          emailAddress: 'jd@email.com',
          id: 0,
          firstName: 'Jon',
          lastName: 'Doe-',
          phoneNumber: '09000000000',
        },
        expectedError: new LastNameError(),
      },
      {
        name: 'throws if phone number is invalid',
        input: {
          country: 'US',
          emailAddress: 'jd@email.com',
          id: 0,
          firstName: 'Jon',
          lastName: 'Doe',
          phoneNumber: '0808',
        },
        expectedError: new PhoneNumberError(),
      },
      {
        name: 'throws if email is invalid',
        input: {
          country: 'US',
          emailAddress: 'jd-email',
          id: 0,
          firstName: 'Jon',
          lastName: 'Doe',
          phoneNumber: '09000000000',
        },
        expectedError: new EmailError(),
      },
      {
        name: 'throws if country is invalid',
        input: {
          country: 'GB',
          emailAddress: 'jd@email.com',
          id: 0,
          firstName: 'Jon',
          lastName: 'Doe',
          phoneNumber: '09000000000',
        },
        expectedError: new CountryError(),
      },
      {
        name: 'does not throw if all fields are valid',
        input: {
          country: 'US',
          emailAddress: 'jd@email.com',
          id: 0,
          firstName: 'Jon',
          lastName: 'Doe',
          phoneNumber: '09000000000',
        },
        expectedError: null,
      },
    ];

    for (let tc of testCases) {
      it(tc.name, function () {
        const fn = () => {
          // eslint-disable-next-line no-new
          new UserInfo(tc.input);
        };
        if (tc.expectedError != null) {
          expect(fn).toThrow(tc.expectedError);
          return;
        }
        expect(fn).not.toThrow();
      });
    }
  });

  describe('Getters', () => {
    const user = new UserInfo({
      id: 1,
      firstName: 'John',
      lastName: 'Do',
      emailAddress: 'johndo@email.com',
      phoneNumber: '09000000000',
      country: 'NG',
    });
    type TestCase = {
      name: string;
      input: UserInfo;
      setExpectation: (input: UserInfo) => void;
    };
    const testCases: TestCase[] = [
      {
        name: 'gets first name from initial instance',
        input: user,
        setExpectation: (input: UserInfo) => {
          expect(input.FirstName()).toBe('John');
        },
      },
      {
        name: 'gets last name from initial instance',
        input: user,
        setExpectation: (input: UserInfo) => {
          expect(input.LastName()).toBe('Do');
        },
      },
      {
        name: 'gets email from initial instance',
        input: user,
        setExpectation: (input: UserInfo) => {
          expect(input.EmailAddress()).toBe('johndo@email.com');
        },
      },
      {
        name: 'gets phone number from initial instance',
        input: user,
        setExpectation: (input: UserInfo) => {
          expect(input.PhoneNumber()).toBe('09000000000');
        },
      },
      {
        name: 'gets country from initial instance',
        input: user,
        setExpectation: (input: UserInfo) => {
          expect(input.Country()).toBe('NG');
        },
      },
      {
        name: 'gets id from initial instance',
        input: user,
        setExpectation: (input: UserInfo) => {
          expect(input.ID()).toBe(1);
        },
      },
      {
        name: 'gets full name from initial names instance',
        input: user,
        setExpectation: (input: UserInfo) => {
          expect(input.FullName()).toBe('John Do');
        },
      },
    ];
    for (let tc of testCases) {
      it(tc.name, () => {
        tc.setExpectation(tc.input);
      });
    }
  });

  describe('Setters', () => {
    type TestCase = {
      name: string;
      input: NewUserInfoInput;
      setValue: (input: UserInfo) => void;
      expectedError: Error | null;
      checkUpdate: (input: UserInfo) => void;
    };
    const newUseRInput: NewUserInfoInput = {
      id: 1,
      firstName: 'Jon',
      lastName: 'Doe',
      emailAddress: 'jd@email.com',
      phoneNumber: '09000000000',
      country: 'NG',
    };
    const testCases: TestCase[] = [
      {
        name: 'throws error if invalid first name is passed',
        input: newUseRInput,
        setValue: (user: UserInfo) => user.SetFirstName('-'),
        checkUpdate: (input: UserInfo) => expect(input.FirstName()).toBe('Jon'),
        expectedError: new FirstNameError(),
      },
      {
        name: 'updates first name is passed',
        input: newUseRInput,
        setValue: (user: UserInfo) => user.SetFirstName('Peter'),
        checkUpdate: (input: UserInfo) =>
          expect(input.FirstName()).toBe('Peter'),
        expectedError: null,
      },
      {
        name: 'throws error if invalid last name is passed',
        input: newUseRInput,
        setValue: (user: UserInfo) => user.SetLastName('-'),
        checkUpdate: (input: UserInfo) => expect(input.LastName()).toBe('Doe'),
        expectedError: new LastNameError(),
      },
      {
        name: 'updates last name is passed',
        input: newUseRInput,
        setValue: (user: UserInfo) => user.SetLastName('Do'),
        checkUpdate: (input: UserInfo) => expect(input.LastName()).toBe('Do'),
        expectedError: null,
      },
      {
        name: 'throws error if invalid phone number is passed',
        input: newUseRInput,
        setValue: (user: UserInfo) => user.SetPhoneNumber('+44'),
        checkUpdate: (input: UserInfo) =>
          expect(input.PhoneNumber()).toBe('09000000000'),
        expectedError: new PhoneNumberError(),
      },
      {
        name: 'updates phone number is passed',
        input: newUseRInput,
        setValue: (user: UserInfo) => user.SetPhoneNumber('+2349000000000'),
        checkUpdate: (input: UserInfo) =>
          expect(input.PhoneNumber()).toBe('+2349000000000'),
        expectedError: null,
      },
    ];
    for (let tc of testCases) {
      it(tc.name, () => {
        const user = new UserInfo(tc.input);
        const fn = () => {
          tc.setValue(user);
        };
        if (tc.expectedError) {
          expect(fn).toThrow(tc.expectedError);
        } else {
          expect(fn).not.toThrow();
        }
        tc.checkUpdate(user);
      });
    }
  });
});
