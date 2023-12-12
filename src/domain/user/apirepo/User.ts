import {CountryCode} from 'libphonenumber-js';
import {UserInfo} from '../../../entities/user-info/UserInfo';
import {HttpClient} from '../../../infra/http-client/HttpClient';
import Aggregate from '../Aggregate';
import {UserRepository} from '../Repository';
import {
  GetProfileError,
  UpdateProfileError,
  UserRepositoryError,
} from '../Errors';

export type NewUserRepoInput = {
  httpClient: HttpClient;
};

type UserInfoResponse = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  country_code: CountryCode;
};

function toAggregate(input: UserInfoResponse): Aggregate {
  const userInfo = new UserInfo({
    country: input.country_code,
    firstName: input.first_name,
    lastName: input.last_name,
    emailAddress: input.email,
    id: input.id,
    phoneNumber: input.phone_number || '',
  });
  return new Aggregate({userInfo: userInfo});
}

const ErrorCodes: Record<string, string> = {
  '1000001': 'Please log in and try again.',
};

function getErrorMessage(code: string): string {
  let message = ErrorCodes[code];
  if (!message) {
    message = `An error with the status code ${code} has occurred.`;
  }
  return message;
}

export class User implements UserRepository {
  private client: HttpClient;

  constructor(input: NewUserRepoInput) {
    if (!input.httpClient) {
      throw new ClientRequiredError();
    }
    this.client = input.httpClient;
  }

  GetProfile(as: AbortSignal): Promise<Aggregate | null> {
    return new Promise(async (res, rej) => {
      try {
        // create client abort controller
        const cac = new AbortController();
        // listen for abort on signal
        as.addEventListener('abort', () => {
          if (!cac.signal.aborted) {
            cac.abort();
          }
        });
        // make http request
        const hr = await this.client.get<unknown, UserInfoResponse>({
          abortSignal: cac.signal,
          endpoint: '/me',
        });
        // handle cancel
        if (hr.cancelled) {
          return res(null);
        }
        // handle error result
        if (hr.error) {
          return rej(new GetProfileError(getErrorMessage(hr.error.errorCode)));
        }
        // handle no result
        if (!hr.result) {
          return rej(
            new UserRepositoryError(
              'An unexpected error occurred. Please try again.',
            ),
          );
        }
        // create aggregate from result
        const user = await toAggregate(hr.result);
        // return success
        res(user);
      } catch (e) {
        // return thrown error
        return rej(e);
      }
    });
  }

  UpdateProfile(as: AbortSignal, input: Aggregate): Promise<true | null> {
    return new Promise(async (res, rej) => {
      try {
        // create client abort controller
        const cac = new AbortController();
        // listen for abort on signal
        as.addEventListener('abort', () => {
          if (!cac.signal.aborted) {
            cac.abort();
          }
        });
        // make http request
        const hr = await this.client.put({
          abortSignal: cac.signal,
          endpoint: '/update-me',
          data: {
            first_name: input.FirstName(),
            last_name: input.LastName,
            phon: input.PhoneNumber(),
          },
        });
        // handle cancel
        if (hr.cancelled) {
          return res(null);
        }
        // handle error response
        if (hr.error) {
          return rej(
            new UpdateProfileError(getErrorMessage(hr.error.errorCode)),
          );
        }
        // handle success
        return res(true);
      } catch (e) {
        // reject with error
        return rej(e);
      }
    });
  }
}

export class ClientRequiredError extends Error {
  constructor() {
    super('http client is required');
  }
}
