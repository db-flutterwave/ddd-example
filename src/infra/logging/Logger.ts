export type ErrorInput =
  | Error
  | TypeError
  | EvalError
  | RangeError
  | AggregateError
  | ReferenceError;

export type InfoInput = Record<string, any>;

export type WarnInput = Record<string, any>;

export type DebugInput = Record<string, any>;

export interface Logger {
  /**
   * This is used to log informational data. Ensure all sensitive information
   * is stripped out or masked before logging.
   * @param input InfoInput
   * @returns void
   */
  info(input: InfoInput): Promise<boolean>;

  /**
   * This is used to log errors that occur within the app, the errors will be
   * captured and logged with a third-party, ensure sensitive information is
   * excluded when logging an error.
   * @param input ErrorInput
   * @returns voice
   */
  error(input: ErrorInput): Promise<boolean>;

  /**
   * This is used to log warnings, this helps for early detection of things
   * that might lead to problems down the line. Ensure sensitive information is
   * excluded when logging an error.
   * @param input WarnInput
   * @returns void
   */
  warn(input: WarnInput): Promise<boolean>;

  /**
   * This is for debug purposes, this is used to log information used for
   * debugging issues. Ensure sensitive information is excluded when logging
   * an error.
   * @param input DebugInput
   * @returns void
   */
  debug(input: DebugInput): Promise<boolean>;
}
