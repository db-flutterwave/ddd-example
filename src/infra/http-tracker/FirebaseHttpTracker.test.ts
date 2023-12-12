import perf from '@react-native-firebase/perf';
import FirebaseHttpTracker from './FirebaseHttpTracker';
import {HttpTrackerStartInput} from './HttpTracker';

describe('FirebaseHttpTracker', () => {
  describe('Start', () => {
    const tracker = new FirebaseHttpTracker();
    afterEach(() => {
      jest.clearAllMocks();
    });
    type TestCase = {
      name: string;
      input: HttpTrackerStartInput;
      setExpectations: (done: jest.DoneCallback) => void;
    };
    const testCases: TestCase[] = [
      {
        name: 'starts and stops tracking',
        input: {
          method: 'Get',
          url: 'http://example.com/test',
        },
        setExpectations: (done: jest.DoneCallback) => {
          expect(perf).toHaveBeenCalledTimes(1);
          done();
        },
      },
    ];
    for (let tc of testCases) {
      it(tc.name, done => {
        tracker.start(tc.input).then(() => {
          tc.setExpectations(done);
        });
      });
    }
  });

  describe('Stop', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    type TestCase = {
      name: string;
      expectedResult: boolean;
      stopSession: (
        sessionID: string,
        tracker: FirebaseHttpTracker,
      ) => Promise<boolean>;
    };
    const testCases: TestCase[] = [
      {
        name: 'stops a started session',
        expectedResult: true,
        stopSession: (sessionID, tracker) => {
          return tracker.stop({
            contentType: 'test/test',
            responseCode: 200,
            sessionID: sessionID,
          });
        },
      },
      {
        name: 'does not stop an unknown session',
        expectedResult: false,
        stopSession: (_sessionID, tracker) => {
          return tracker.stop({
            contentType: 'test/test',
            responseCode: 200,
            sessionID: '3804093409834',
          });
        },
      },
    ];
    for (let tc of testCases) {
      it(tc.name, done => {
        const tracker = new FirebaseHttpTracker();
        (async () => {
          const sessionID = await tracker.start({
            method: 'Get',
            url: 'http://example.com/test',
          });
          const result = await tc.stopSession(sessionID, tracker);
          expect(result).toBe(tc.expectedResult);
          done();
        })();
      });
    }
  });
});
