import {DebugInput, ErrorInput, InfoInput, Logger, WarnInput} from './Logger';

export class MockLogger implements Logger {
  info(_input: InfoInput): Promise<boolean> {
    // do nothing
    return Promise.resolve(true);
  }
  error(_input: ErrorInput): Promise<boolean> {
    // do nothing
    return Promise.resolve(true);
  }
  warn(_input: WarnInput): Promise<boolean> {
    // do nothing
    return Promise.resolve(true);
  }
  debug(_input: DebugInput): Promise<boolean> {
    // do nothing
    return Promise.resolve(true);
  }
}
