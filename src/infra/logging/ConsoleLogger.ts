import {DebugInput, ErrorInput, InfoInput, Logger, WarnInput} from './Logger';

export class ConsoleLogger implements Logger {
  private logHeader() {
    console.log('\n\n______________________________');
  }

  private logFooter() {
    console.log('______________________________\n\n');
  }

  info(input: InfoInput): Promise<boolean> {
    if (!__DEV__) {
      return Promise.resolve(false);
    }
    this.logHeader();
    for (let key in input) {
      console.info(`${key}: ${input[key]}`);
    }
    this.logFooter();
    return Promise.resolve(true);
  }

  error(error: ErrorInput): Promise<boolean> {
    if (!__DEV__) {
      return Promise.resolve(false);
    }
    const {name, stack, message, ...other} = error;
    this.logHeader();
    console.log(`${name}: (${message})\n`);
    console.log('Stack Trace');
    console.log(stack);
    if (other) {
      console.log('\n____________________________');
      console.log('Other');
      const otherInfo = other as Record<string, any>;
      for (let key in otherInfo) {
        console.info(`\n${key}: ${otherInfo[key]}\n`);
      }
    }
    this.logFooter();
    return Promise.resolve(true);
  }

  warn(input: WarnInput): Promise<boolean> {
    if (!__DEV__) {
      return Promise.resolve(true);
    }
    this.logHeader();
    for (let key in input) {
      console.warn(`${key}: ${input[key]}`);
    }
    this.logFooter();
    return Promise.resolve(true);
  }

  debug(input: DebugInput): Promise<boolean> {
    if (!__DEV__) {
      return Promise.resolve(false);
    }
    this.logHeader();
    for (let key in input) {
      console.log(`${key}: ${input[key]}`);
    }
    this.logFooter();
    return Promise.resolve(true);
  }
}
