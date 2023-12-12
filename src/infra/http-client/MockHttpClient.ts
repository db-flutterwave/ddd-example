import {
  HttpClient,
  HttpClientDeleteInput,
  HttpClientGetInput,
  HttpClientPostInput,
  HttpClientPutInput,
  RequestOutput,
} from './HttpClient';

export type NewMockHttpClientInput = {
  // output
  getOutput?: RequestOutput;
  postOutput?: RequestOutput;
  putOutput?: RequestOutput;
  deleteOutput?: RequestOutput;
  // mock thrown error
  getError?: Error;
  postError?: Error;
  putError?: Error;
  deleteError?: Error;
};

export class MockHttpClient implements HttpClient {
  // mock output
  private getOutput?: RequestOutput;
  private postOutput?: RequestOutput;
  private putOutput?: RequestOutput;
  private deleteOutput?: RequestOutput;
  // mock thrown error
  private getError?: Error;
  private postError?: Error;
  private putError?: Error;
  private deleteError?: Error;

  constructor(input: NewMockHttpClientInput) {
    // mock output
    this.getOutput = input.getOutput;
    this.postOutput = input.postOutput;
    this.putOutput = input.putOutput;
    this.deleteOutput = input.deleteOutput;
    // mock thrown error
    this.getError = input.getError;
    this.postError = input.postError;
    this.putError = input.putError;
    this.deleteError = input.deleteError;
  }

  get<ErrorData = any, Result = any>(
    _input: HttpClientGetInput,
  ): Promise<RequestOutput<ErrorData, Result>> {
    if (this.getError) {
      return Promise.reject(this.getError);
    }
    if (this.getOutput) {
      return Promise.resolve(this.getOutput);
    }
    return Promise.resolve({
      result: [{name: 'item 1'}] as Result,
    });
  }
  post<ErrorData = any, Result = any>(
    _input: HttpClientPostInput,
  ): Promise<RequestOutput<ErrorData, Result>> {
    if (this.postError) {
      return Promise.reject(this.postError);
    }
    if (this.postOutput) {
      return Promise.resolve(this.postOutput);
    }
    return Promise.resolve({
      result: [{name: 'item 1'}] as Result,
    });
  }
  put<ErrorData = any, Result = any>(
    _input: HttpClientPutInput,
  ): Promise<RequestOutput<ErrorData, Result>> {
    if (this.putError) {
      return Promise.reject(this.putError);
    }
    if (this.putOutput) {
      return Promise.resolve(this.putOutput);
    }
    return Promise.resolve({
      result: [{name: 'item 1'}] as Result,
    });
  }
  delete<ErrorData = any, Result = any>(
    _input: HttpClientDeleteInput,
  ): Promise<RequestOutput<ErrorData, Result>> {
    if (this.deleteError) {
      return Promise.reject(this.deleteError);
    }
    if (this.deleteOutput) {
      return Promise.resolve(this.deleteOutput);
    }
    return Promise.resolve({
      result: [{name: 'item 1'}] as Result,
    });
  }
}
