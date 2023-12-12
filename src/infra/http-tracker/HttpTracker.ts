export type HttpTrackerStartInput = {
  url: string;
  method: string;
};

export type HttpTrackerStopInput = {
  sessionID: string;
  contentType: string;
  responseCode: number;
};

/**
 * This interface serves as the underlying structure for all http metric
 * trackers, more arguments and methods can be added through the implementors
 * constructor or auxiliary methods.
 */
export interface HttpTracker {
  /**
   * Starts tracking the specified URL.
   * @return Promise<void>
   */
  start(input: HttpTrackerStartInput): Promise<string>;

  /**
   * Stops tracking the specified url.
   * @returns Promise<voice>
   */
  stop(input: HttpTrackerStopInput): Promise<boolean>;
}
