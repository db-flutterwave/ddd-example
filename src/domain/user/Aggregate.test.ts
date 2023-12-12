import {UserInfo} from '../../entities/user-info/UserInfo';
import {UserInfoRequiredError} from './Errors';
import User, {NewUserInput} from './Aggregate';

describe('UserAggregate', () => {
  describe('NewUserAggregate', () => {
    type TestCase = {
      name: string;
      input: NewUserInput;
      expectedError: Error | null;
    };
    const userInfo = new UserInfo({
      id: 1,
      firstName: 'Jon',
      lastName: 'Do',
      emailAddress: 'jd@email.com',
      phoneNumber: '09000000000',
      country: 'NG',
    });
    const testCases: TestCase[] = [
      {
        name: 'throws error if user is missing from input',
        input: {},
        expectedError: new UserInfoRequiredError(),
      },
      {
        name: 'creates a new user aggregate',
        input: {userInfo: userInfo},
        expectedError: null,
      },
    ];
    for (let tc of testCases) {
      it(tc.name, () => {
        const fn = () => new User(tc.input);
        if (tc.expectedError) {
          expect(fn).toThrow(tc.expectedError);
          return;
        }
        expect(fn).not.toThrow();
      });
    }
  });
});
