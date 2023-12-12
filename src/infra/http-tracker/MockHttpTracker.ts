import {
  HttpTracker,
  HttpTrackerStartInput,
  HttpTrackerStopInput,
} from './HttpTracker';

export type NewMockHttpTrackerInput = {
  startOutput?: string;
  stopOutput?: boolean;
};

export class MockHttpTracker implements HttpTracker {
  startOutput?: string;
  stopOutput?: boolean;

  constructor(input?: NewMockHttpTrackerInput) {
    this.startOutput = input?.startOutput;
    this.stopOutput = input?.stopOutput;
  }
  start(_input: HttpTrackerStartInput): Promise<string> {
    if (this.startOutput) {
      return Promise.resolve(this.startOutput);
    }
    return Promise.resolve(`mocked-${Date.now()}`);
  }
  stop(_input: HttpTrackerStopInput): Promise<boolean> {
    if (this.stopOutput !== undefined) {
      return Promise.resolve(this.stopOutput);
    }
    return Promise.resolve(true);
  }
}
