import {FirebaseRemoteConfigTypes} from '@react-native-firebase/remote-config';
import {GetOAuthConfigOutput, RemoteConfig} from './RemoteConfig';
import {GetOAuthConfigError} from './Errors';

export type NewFirebaseRemoteConfigInput = {
  client: FirebaseRemoteConfigTypes.Module;
};

export default class FirebaseRemoteConfig implements RemoteConfig {
  client: FirebaseRemoteConfigTypes.Module;
  constructor(input: NewFirebaseRemoteConfigInput) {
    input.client.fetchAndActivate().catch(() => {});
    this.client = input.client;
  }

  private getJSON<R = unknown>(key: string): Promise<R> {
    try {
      const result = this.client.getValue(key).asString();
      if (!result) {
        this.client.fetchAndActivate().catch(() => {});
        return Promise.resolve(null as R);
      }
      return Promise.resolve(JSON.parse(result) as R);
    } catch (e) {
      const errorMessage = (e as Error).message;
      if (/json/.test(errorMessage)) {
        return Promise.reject(
          new FirebaseGetJSONError('value is not a valid json'),
        );
      }
      if (/asString/.test(errorMessage)) {
        return Promise.reject(
          new FirebaseGetJSONError('cannot get result as string'),
        );
      }
      return Promise.reject(e);
    }
  }

  async GetOAuthConfig(): Promise<GetOAuthConfigOutput> {
    try {
      const result = await this.getJSON<GetOAuthConfigOutput>('OAUTH_CONFIG');
      return Promise.resolve(result);
    } catch (e) {
      // log error
      if (e instanceof FirebaseGetJSONError) {
        return Promise.reject(
          new GetOAuthConfigError('unable to get oauth config'),
        );
      }
      // return general error
      return Promise.reject(
        new GetOAuthConfigError('an unexpected error has occurred'),
      );
    }
  }
}

class FirebaseGetJSONError extends Error {
  constructor(message: string) {
    super(message);
  }
}
