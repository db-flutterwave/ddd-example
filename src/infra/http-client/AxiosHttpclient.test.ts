import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import {
  HttpClientDeleteInput,
  HttpClientGetInput,
  HttpClientPostInput,
  HttpClientPutInput,
  RequestOutput,
} from './HttpClient';
import {AxiosHttpClient} from './AxiosHttpClient';
import {MockHttpTracker} from '../http-tracker/MockHttpTracker';

describe('AxiosHttpClient', () => {
  describe('GetRequests', () => {
    const ma = new MockAdapter(axios);
    const abortController = new AbortController();
    afterAll(() => {
      ma.reset();
    });
    type TestCase = {
      name: string;
      input: HttpClientGetInput;
      setMocks: (adapter: MockAdapter) => void;
      testResult: (input: RequestOutput, done: jest.DoneCallback) => void;
    };
    const testCases: TestCase[] = [
      {
        name: 'it returns get success result',
        input: {
          endpoint: '/get-one',
          abortSignal: abortController.signal,
        },
        setMocks: (adapter: MockAdapter) => {
          adapter
            .onGet('http://example.com/get-one')
            .replyOnce(200, {name: 'John'});
        },
        testResult: (input: RequestOutput, done: jest.DoneCallback) => {
          expect(input.result).toBeDefined();
          expect(input.error).toBeUndefined();
          expect(input.cancelled).toBeUndefined();
          expect(input.result.name).toBe('John');
          done();
        },
      },
      {
        name: 'it returns get failure result',
        input: {
          endpoint: '/get-two',
          abortSignal: abortController.signal,
        },
        setMocks: (adapter: MockAdapter) => {
          adapter.onGet('http://example.com/get-two').replyOnce(401, {
            message: 'unauthorized access',
            message_id: '100001',
            otpID: '300940',
          });
        },
        testResult: (input: RequestOutput, done: jest.DoneCallback) => {
          expect(input.result).toBeUndefined();
          expect(input.error).toBeDefined();
          expect(input.cancelled).toBeUndefined();
          expect(input.error?.message).toBe('unauthorized access');
          expect(input.error?.errorCode).toBe('100001');
          expect(input.error?.statusCode).toBe(401);
          expect(input.error?.data).toBeDefined();
          expect(input.error?.data.otpID).toBe('300940');
          done();
        },
      },
      {
        name: 'it returns get cancel result',
        input: {
          endpoint: '/get-three',
          abortSignal: abortController.signal,
        },
        setMocks: (adapter: MockAdapter) => {
          adapter.onGet('http://example.com/get-three').abortRequestOnce();
        },
        testResult: (input: RequestOutput, done: jest.DoneCallback) => {
          expect(input.result).toBeUndefined();
          expect(input.error).toBeUndefined();
          expect(input.cancelled).toBeDefined();
          expect(input.cancelled).toBe(true);
          done();
        },
      },
    ];
    const httpTracker = new MockHttpTracker();
    const client = new AxiosHttpClient({
      baseUrl: 'http://example.com',
      httpTracker: httpTracker,
    });
    for (let tc of testCases) {
      tc.setMocks(ma);
      it(tc.name, done => {
        client.get(tc.input).then(output => {
          tc.testResult(output, done);
        });
      });
    }
  });
  describe('PostRequests', () => {
    const ma = new MockAdapter(axios);
    const abortController = new AbortController();
    afterAll(() => {
      ma.reset();
    });
    type TestCase = {
      name: string;
      input: HttpClientPostInput;
      setMocks: (adapter: MockAdapter) => void;
      testResult: (input: RequestOutput, done: jest.DoneCallback) => void;
    };
    const testCases: TestCase[] = [
      {
        name: 'it returns post success result',
        input: {
          endpoint: '/post-one',
          abortSignal: abortController.signal,
          data: {},
        },
        setMocks: (adapter: MockAdapter) => {
          adapter
            .onPost('http://example.com/post-one')
            .replyOnce(200, {name: 'John'});
        },
        testResult: (input: RequestOutput, done: jest.DoneCallback) => {
          expect(input.result).toBeDefined();
          expect(input.error).toBeUndefined();
          expect(input.cancelled).toBeUndefined();
          expect(input.result.name).toBe('John');
          done();
        },
      },
      {
        name: 'it returns post failure result',
        input: {
          endpoint: '/post-two',
          abortSignal: abortController.signal,
          data: {},
        },
        setMocks: (adapter: MockAdapter) => {
          adapter.onPost('http://example.com/post-two').replyOnce(401, {
            message: 'unauthorized access',
            message_id: '100001',
            otpID: '300940',
          });
        },
        testResult: (input: RequestOutput, done: jest.DoneCallback) => {
          expect(input.result).toBeUndefined();
          expect(input.error).toBeDefined();
          expect(input.cancelled).toBeUndefined();
          expect(input.error?.message).toBe('unauthorized access');
          expect(input.error?.errorCode).toBe('100001');
          expect(input.error?.statusCode).toBe(401);
          expect(input.error?.data).toBeDefined();
          expect(input.error?.data.otpID).toBe('300940');
          done();
        },
      },
      {
        name: 'it returns post cancel result',
        input: {
          endpoint: '/post-three',
          abortSignal: abortController.signal,
          data: {},
        },
        setMocks: (adapter: MockAdapter) => {
          adapter.onPost('http://example.com/post-three').abortRequestOnce();
        },
        testResult: (input: RequestOutput, done: jest.DoneCallback) => {
          expect(input.result).toBeUndefined();
          expect(input.error).toBeUndefined();
          expect(input.cancelled).toBeDefined();
          expect(input.cancelled).toBe(true);
          done();
        },
      },
    ];
    const httpTracker = new MockHttpTracker();
    const client = new AxiosHttpClient({
      baseUrl: 'http://example.com',
      httpTracker: httpTracker,
    });
    for (let tc of testCases) {
      tc.setMocks(ma);
      it(tc.name, done => {
        client.post(tc.input).then(output => {
          tc.testResult(output, done);
        });
      });
    }
  });
  describe('PutRequests', () => {
    const ma = new MockAdapter(axios);
    const abortController = new AbortController();
    afterAll(() => {
      ma.reset();
    });
    type TestCase = {
      name: string;
      input: HttpClientPutInput;
      setMocks: (adapter: MockAdapter) => void;
      testResult: (input: RequestOutput, done: jest.DoneCallback) => void;
    };
    const testCases: TestCase[] = [
      {
        name: 'it returns put success result',
        input: {
          endpoint: '/put-one',
          abortSignal: abortController.signal,
          data: {},
        },
        setMocks: (adapter: MockAdapter) => {
          adapter
            .onPut('http://example.com/put-one')
            .replyOnce(200, {name: 'John'});
        },
        testResult: (input: RequestOutput, done: jest.DoneCallback) => {
          expect(input.result).toBeDefined();
          expect(input.error).toBeUndefined();
          expect(input.cancelled).toBeUndefined();
          expect(input.result.name).toBe('John');
          done();
        },
      },
      {
        name: 'it returns put failure result',
        input: {
          endpoint: '/put-two',
          abortSignal: abortController.signal,
          data: {},
        },
        setMocks: (adapter: MockAdapter) => {
          adapter.onPut('http://example.com/put-two').replyOnce(401, {
            message: 'unauthorized access',
            message_id: '100001',
            otpID: '300940',
          });
        },
        testResult: (input: RequestOutput, done: jest.DoneCallback) => {
          expect(input.result).toBeUndefined();
          expect(input.error).toBeDefined();
          expect(input.cancelled).toBeUndefined();
          expect(input.error?.message).toBe('unauthorized access');
          expect(input.error?.errorCode).toBe('100001');
          expect(input.error?.statusCode).toBe(401);
          expect(input.error?.data).toBeDefined();
          expect(input.error?.data.otpID).toBe('300940');
          done();
        },
      },
      {
        name: 'it returns put cancel result',
        input: {
          endpoint: '/put-three',
          abortSignal: abortController.signal,
          data: {},
        },
        setMocks: (adapter: MockAdapter) => {
          adapter.onPut('http://example.com/put-three').abortRequestOnce();
        },
        testResult: (input: RequestOutput, done: jest.DoneCallback) => {
          expect(input.result).toBeUndefined();
          expect(input.error).toBeUndefined();
          expect(input.cancelled).toBeDefined();
          expect(input.cancelled).toBe(true);
          done();
        },
      },
    ];
    const httpTracker = new MockHttpTracker();
    const client = new AxiosHttpClient({
      baseUrl: 'http://example.com',
      httpTracker: httpTracker,
    });
    for (let tc of testCases) {
      tc.setMocks(ma);
      it(tc.name, done => {
        client.put(tc.input).then(output => {
          tc.testResult(output, done);
        });
      });
    }
  });
  describe('DeleteRequests', () => {
    const ma = new MockAdapter(axios);
    const abortController = new AbortController();
    afterAll(() => {
      ma.reset();
    });
    type TestCase = {
      name: string;
      input: HttpClientDeleteInput;
      setMocks: (adapter: MockAdapter) => void;
      testResult: (input: RequestOutput, done: jest.DoneCallback) => void;
    };
    const testCases: TestCase[] = [
      {
        name: 'it returns put success result',
        input: {
          endpoint: '/put-one',
          abortSignal: abortController.signal,
        },
        setMocks: (adapter: MockAdapter) => {
          adapter
            .onDelete('http://example.com/put-one')
            .replyOnce(200, {name: 'John'});
        },
        testResult: (input: RequestOutput, done: jest.DoneCallback) => {
          expect(input.result).toBeDefined();
          expect(input.error).toBeUndefined();
          expect(input.cancelled).toBeUndefined();
          expect(input.result.name).toBe('John');
          done();
        },
      },
      {
        name: 'it returns put failure result',
        input: {
          endpoint: '/put-two',
          abortSignal: abortController.signal,
        },
        setMocks: (adapter: MockAdapter) => {
          adapter.onDelete('http://example.com/put-two').replyOnce(401, {
            message: 'unauthorized access',
            message_id: '100001',
            otpID: '300940',
          });
        },
        testResult: (input: RequestOutput, done: jest.DoneCallback) => {
          expect(input.result).toBeUndefined();
          expect(input.error).toBeDefined();
          expect(input.cancelled).toBeUndefined();
          expect(input.error?.message).toBe('unauthorized access');
          expect(input.error?.errorCode).toBe('100001');
          expect(input.error?.statusCode).toBe(401);
          expect(input.error?.data).toBeDefined();
          expect(input.error?.data.otpID).toBe('300940');
          done();
        },
      },
      {
        name: 'it returns put cancel result',
        input: {
          endpoint: '/put-three',
          abortSignal: abortController.signal,
        },
        setMocks: (adapter: MockAdapter) => {
          adapter.onDelete('http://example.com/put-three').abortRequestOnce();
        },
        testResult: (input: RequestOutput, done: jest.DoneCallback) => {
          expect(input.result).toBeUndefined();
          expect(input.error).toBeUndefined();
          expect(input.cancelled).toBeDefined();
          expect(input.cancelled).toBe(true);
          done();
        },
      },
    ];
    const httpTracker = new MockHttpTracker();
    const client = new AxiosHttpClient({
      baseUrl: 'http://example.com',
      httpTracker: httpTracker,
    });
    for (let tc of testCases) {
      tc.setMocks(ma);
      it(tc.name, done => {
        client.delete(tc.input).then(output => {
          tc.testResult(output, done);
        });
      });
    }
  });
});
