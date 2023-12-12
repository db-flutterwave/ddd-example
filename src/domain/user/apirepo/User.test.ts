import {NewUserRepoInput, User} from './User';

describe('APIRepo.User', () => {
  describe('NewUser', () => {
    // define test case
    type TestCase = {
      name: string;
      input: NewUserRepoInput;
      expectedError: Error | null;
    };
    // create test cases
    const testCases: TestCase[] = [];
    // run test cases
    for (let tc of testCases) {
      it(tc.name, () => {
        const fn = () => new User(tc.input);
        if (tc.expectedError) {
          expect(fn).toThrow(tc.expectedError);
        } else {
          expect(fn).not.toThrow();
        }
      });
    }
  });
});
