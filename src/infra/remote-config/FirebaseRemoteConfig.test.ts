import {GetOAuthConfigError} from './Errors';
import FirebaseRemoteConfig from './FirebaseRemoteConfig';
import {OAuthConfig} from './RemoteConfig';

describe('FirebaseRemoteConfig', () => {
  describe('GetOAuthNonThrowing', () => {
    beforeEach(() => {
      jest.resetModules();
    });
    type TestCase = {
      name: string;
      asStringResult?: string;
      expectedResult: string;
      fetchAndActivate?: () => void;
    };
    const testCases: TestCase[] = [
      {
        name: 'returns a null value if config is not found',
        expectedResult: JSON.stringify(null),
      },
      {
        name: 'returns a null value if config is not found',
        expectedResult: JSON.stringify({}),
        asStringResult: JSON.stringify({} as OAuthConfig),
        fetchAndActivate: jest.fn(() => Promise.resolve()),
      },
    ];
    for (let tc of testCases) {
      test(tc.name, done => {
        jest.doMock('@react-native-firebase/remote-config', () => () => ({
          fetchAndActivate: tc.fetchAndActivate
            ? tc.fetchAndActivate
            : () => Promise.resolve(),
          getValue: () => ({
            asString: () => tc.asStringResult,
          }),
        }));
        const firebase = require('@react-native-firebase/remote-config');
        const remoteConfig = new FirebaseRemoteConfig({client: firebase()});
        remoteConfig.GetOAuthConfig().then(oAuthConfig => {
          expect(JSON.stringify(oAuthConfig)).toBe(tc.expectedResult);
          if (tc.fetchAndActivate) {
            expect(tc.fetchAndActivate).toHaveBeenCalledTimes(1);
          }
          done();
        });
      });
    }
  });

  describe('GetOAuthErrors', () => {
    beforeEach(() => {
      jest.resetModules();
    });
    type TestCase = {
      name: string;
      getValue: () => void;
      expectedError: Error;
    };
    const testCases: TestCase[] = [
      {
        name: 'throws if as string is undefined',
        getValue: jest.fn(() => {}),
        expectedError: new GetOAuthConfigError('unable to get oauth config'),
      },
      {
        name: 'throws if as string is null',
        getValue: jest.fn(() => null),
        expectedError: new GetOAuthConfigError('unable to get oauth config'),
      },
      {
        name: 'throws if json is invalid',
        getValue: jest.fn(() => ({
          asString: () => 'invalid json',
        })),
        expectedError: new GetOAuthConfigError('unable to get oauth config'),
      },
      {
        name: 'throws if as string throws an error',
        getValue: jest.fn(() => ({
          asString: jest.fn(() => {
            throw new Error('mocked error');
          }),
        })),
        expectedError: new GetOAuthConfigError(
          'an unexpected error has occurred',
        ),
      },
      {
        name: 'throws if getValue throws an error',
        getValue: jest.fn(() => {
          throw new Error('mocked error');
        }),
        expectedError: new GetOAuthConfigError(
          'an unexpected error has occurred',
        ),
      },
    ];
    for (let tc of testCases) {
      test(tc.name, done => {
        jest.doMock('@react-native-firebase/remote-config', () => () => ({
          fetchAndActivate: () => Promise.resolve(),
          getValue: tc.getValue,
        }));
        const firebase = require('@react-native-firebase/remote-config');
        const remoteConfig = new FirebaseRemoteConfig({client: firebase()});
        remoteConfig.GetOAuthConfig().catch(e => {
          expect(e.message).toBe(tc.expectedError.message);
          done();
        });
      });
    }
  });

  // <describe />
  // Test GetOAuth Throwing
  // invalid JSON was returned for getValue
  // getValue threw
  // asString threw
  // JSON is valid
});
