import {ValueObject} from '../ValueObject';

type NewVerificationInput = {
  status: string;
  provider: string | null;
};

const validStatuses = ['pending', 'not-started', 'completed', 'failed'];
const validProviders = ['veriff', 'smile'];

export class Verification implements ValueObject {
  private status: string;
  private provider: string | null;

  constructor(input: NewVerificationInput) {
    if (validStatuses.indexOf(input.status) === -1) {
      throw new Error('status is invalid');
    }
    if (
      input.provider != null &&
      validProviders.indexOf(input.provider) === -1
    ) {
      throw new Error('provider is invalid');
    }
    this.status = input.status;
    this.provider = input.provider;
  }

  Status(): string {
    return this.status;
  }

  Provider(): string | null {
    return this.provider;
  }

  toValue(): string {
    return `${this.status}:${this.provider}`;
  }
}
