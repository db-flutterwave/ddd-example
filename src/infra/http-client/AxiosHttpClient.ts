import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CancelToken,
  Canceler,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  HttpClient,
  HttpClientDeleteInput,
  HttpClientGetInput,
  HttpClientPostInput,
  HttpClientPutInput,
  HttpRequestHeaders,
  RequestError,
  RequestOutput,
} from './HttpClient';
import {HttpTracker} from '../http-tracker/HttpTracker';
import {BaseURLRequiredError, HttpTrackerRequiredError} from './Errors';

export type NewAxiosHttpClientInput = {
  baseUrl: string;
  httpTracker: HttpTracker;
};

type CreateErrorResultInput = AxiosError<
  {message_id: string; message: string},
  unknown
>;

interface ConfigWithMetaData extends InternalAxiosRequestConfig<unknown> {
  metaData?: {
    trackingSessionID: string;
  };
}

interface Response extends AxiosResponse<unknown> {
  config: ConfigWithMetaData;
}

export class AxiosHttpClient implements HttpClient {
  /**
   * @var AxiosInstance
   */
  private client: AxiosInstance;

  /**
   * @var HttpTracker
   */
  private httpTracker: HttpTracker;

  constructor(input: NewAxiosHttpClientInput) {
    if (!input.baseUrl) {
      throw new BaseURLRequiredError();
    }
    if (!input.httpTracker) {
      throw new HttpTrackerRequiredError();
    }
    // create client
    this.client = axios.create({baseURL: input.baseUrl});
    // set axios interceptors
    this.client.interceptors.request.use(
      this.requestSuccessInterceptor,
      this.requestErrorInterceptor,
    );
    this.client.interceptors.response.use(
      this.responseSuccessInterceptor,
      this.responseErrorInterceptor,
    );
    // set http tracker
    this.httpTracker = input.httpTracker;
  }

  private async requestSuccessInterceptor(
    config: ConfigWithMetaData,
  ): Promise<ConfigWithMetaData> {
    try {
      const sessionID = await this.httpTracker.start({
        url: config.url!,
        method: config.method!,
      });
      config.metaData = {trackingSessionID: sessionID};
    } catch (e) {
      // log error and continue
    } finally {
      return Promise.resolve(config);
    }
  }

  private requestErrorInterceptor(error: unknown) {
    return Promise.reject(error);
  }

  private async responseSuccessInterceptor(
    response: Response,
  ): Promise<Response> {
    try {
      const trackingSessionID = response.config.metaData?.trackingSessionID;
      if (trackingSessionID) {
        await this.httpTracker.stop({
          contentType: response.headers['content-type'] || 'unknown',
          responseCode: response.status,
          sessionID: trackingSessionID,
        });
      }
    } catch (e) {
      // log error and continue
    } finally {
      return Promise.resolve(response);
    }
  }

  private async responseErrorInterceptor(error: {response?: Response}) {
    try {
      // stop http tracking
      const trackingSessionID =
        error?.response?.config.metaData?.trackingSessionID;
      const responseWithConfig = error.response;
      if (trackingSessionID && responseWithConfig) {
        await this.httpTracker.stop({
          contentType: responseWithConfig.headers['content-type'] || 'unknown',
          responseCode: responseWithConfig.status || 0,
          sessionID: trackingSessionID,
        });
      }
      // check if error is network error and set correct message
    } catch (e) {
      // log error
    } finally {
      return Promise.reject(error);
    }
  }

  private createCancelToken(signal: AbortSignal): CancelToken {
    // create canceler
    let canceller: Canceler;
    const cancelToken = new axios.CancelToken(c => (canceller = c));
    signal.addEventListener('abort', () => {
      canceller();
    });
    return cancelToken;
  }

  private createErrorResult<ErrorData>(
    input: AxiosError<{message_id: string; message: string}, unknown>,
  ): RequestError<ErrorData> {
    const {message, message_id, ...responseData} = input.response?.data || {};
    return {
      data: responseData,
      errorCode: message_id || 'UNKNOWN',
      statusCode: input.response?.status || input.status || 0,
      message: message || input.message,
    } as RequestError<ErrorData>;
  }

  private createRequestHeaders(
    input: HttpRequestHeaders | undefined,
    excludeAccessToken?: boolean,
  ): HttpRequestHeaders {
    let headers: HttpRequestHeaders = {};
    if (input) {
      headers = {...input};
    }
    if (!excludeAccessToken) {
      // add access token to headers
    }
    return headers;
  }

  private checkIfErrorIsAborted(e: Error): boolean {
    return axios.isCancel(e) || /aborted/i.test((e as Error).message);
  }

  async get<ErrorData = unknown, Result = unknown>(
    input: HttpClientGetInput,
  ): Promise<RequestOutput<ErrorData, Result>> {
    try {
      const cancelToken = this.createCancelToken(input.abortSignal);
      const result = await this.client.get(input.endpoint, {
        params: input.params,
        headers: this.createRequestHeaders(
          input.headers,
          input.excludeAccessToken,
        ),
        cancelToken: cancelToken,
      });
      // output success
      return Promise.resolve({
        result: result.data as Result,
      });
    } catch (e) {
      // output cancelled
      if (this.checkIfErrorIsAborted(e as Error)) {
        return Promise.resolve({cancelled: true});
      }
      // output error
      return Promise.resolve({
        error: this.createErrorResult<ErrorData>(e as CreateErrorResultInput),
      });
    }
  }

  async post<ErrorData = unknown, Result = unknown>(
    input: HttpClientPostInput,
  ): Promise<RequestOutput<ErrorData, Result>> {
    try {
      const cancelToken = this.createCancelToken(input.abortSignal);
      const result = await this.client.post(input.endpoint, input.data, {
        params: input.params,
        headers: this.createRequestHeaders(
          input.headers,
          input.excludeAccessToken,
        ),
        cancelToken: cancelToken,
      });
      // output success
      return Promise.resolve({
        result: result.data as Result,
      });
    } catch (e) {
      // output cancelled
      if (this.checkIfErrorIsAborted(e as Error)) {
        return Promise.resolve({cancelled: true});
      }
      // output error
      return Promise.resolve({
        error: this.createErrorResult<ErrorData>(e as CreateErrorResultInput),
      });
    }
  }

  async put<ErrorData = unknown, Result = unknown>(
    input: HttpClientPutInput,
  ): Promise<RequestOutput<ErrorData, Result>> {
    try {
      const cancelToken = this.createCancelToken(input.abortSignal);
      const result = await this.client.put(input.endpoint, input.data, {
        params: input.params,
        headers: this.createRequestHeaders(
          input.headers,
          input.excludeAccessToken,
        ),
        cancelToken: cancelToken,
      });
      // output success
      return Promise.resolve({
        result: result.data as Result,
      });
    } catch (e) {
      // output cancelled
      if (this.checkIfErrorIsAborted(e as Error)) {
        return Promise.resolve({cancelled: true});
      }
      // output error
      return Promise.resolve({
        error: this.createErrorResult<ErrorData>(e as CreateErrorResultInput),
      });
    }
  }

  async delete<ErrorData = unknown, Result = unknown>(
    input: HttpClientDeleteInput,
  ): Promise<RequestOutput<ErrorData, Result>> {
    try {
      const cancelToken = this.createCancelToken(input.abortSignal);
      const result = await this.client.delete(input.endpoint, {
        params: input.params,
        headers: this.createRequestHeaders(
          input.headers,
          input.excludeAccessToken,
        ),
        cancelToken: cancelToken,
      });
      // output success
      return Promise.resolve({
        result: result.data as Result,
      });
    } catch (e) {
      // output cancelled
      if (this.checkIfErrorIsAborted(e as Error)) {
        return Promise.resolve({cancelled: true});
      }
      // output error
      return Promise.resolve({
        error: this.createErrorResult<ErrorData>(e as CreateErrorResultInput),
      });
    }
  }
}
