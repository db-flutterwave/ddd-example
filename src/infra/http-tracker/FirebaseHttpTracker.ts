import perf, {FirebasePerformanceTypes} from '@react-native-firebase/perf';
import {
  HttpTracker,
  HttpTrackerStartInput,
  HttpTrackerStopInput,
} from './HttpTracker';

class FirebaseHttpTracker implements HttpTracker {
  private sessions: Record<string, FirebasePerformanceTypes.HttpMetric> = {};

  start(input: HttpTrackerStartInput): Promise<string> {
    const sessionID = `${Date.now()}${Math.ceil(Math.random() * 999)}`;
    const session = perf().newHttpMetric(
      input.url,
      input.method.toUpperCase() as FirebasePerformanceTypes.HttpMethod,
    );
    this.sessions[sessionID] = session;
    return Promise.resolve(sessionID);
  }

  async stop(input: HttpTrackerStopInput): Promise<boolean> {
    const session = this.sessions[input.sessionID];
    if (!session) {
      return Promise.resolve(false);
    }
    session.setHttpResponseCode(input.responseCode);
    session.setResponseContentType(input.contentType);
    await session.stop();
    delete this.sessions[input.sessionID];
    return Promise.resolve(true);
  }
}

export default FirebaseHttpTracker;
