export type HttpRequestHeaders = Record<string, string>;

interface HttpClientDefaults {
  /**
   * This is the endpoint being called, it shouldn't contain the base url.
   */
  endpoint: string;
  /**
   * This will be passed as the get params in the url when making the call.
   */
  params?: Record<string, any>;
  /**
   * Required for aborting and cancelling http requests.
   */
  abortSignal: AbortSignal;
  /**
   * This is used to exclude the access token when making a request to the API.
   */
  excludeAccessToken?: boolean;
  headers?: HttpRequestHeaders;
}

export interface HttpClientGetInput extends HttpClientDefaults {}

export interface HttpClientPostInput extends HttpClientDefaults {
  data: Record<string, any>;
}

export interface HttpClientPutInput extends HttpClientDefaults {
  data: Record<string, any>;
}

export interface HttpClientDeleteInput extends HttpClientDefaults {}

export type RequestError<D = any> = {
  message: string;
  errorCode: string;
  statusCode: number;
  data?: D;
} | null;

export type RequestCancelled = boolean;

export type RequestOutput<ErrorData = any, Result = any> = {
  cancelled?: boolean;
  error?: RequestError<ErrorData>;
  result?: Result;
};

/**
 * This represents the blueprint for all HTTP Clients that will be used across
 * the entire app, no http client should be directly coupled with the app, the
 * app must depend on this interface to allow for easy implementation
 * replacement.
 */
export interface HttpClient {
  /**
   * used to make Get HTTP requests
   * @param input HttpClientGetInput
   */
  get<ErrorData = any, Result = any>(
    input: HttpClientGetInput,
  ): Promise<RequestOutput<ErrorData, Result>>;

  /**
   * used to make Post HTTP requests
   * @param input HttpClientPostInput
   */
  post<ErrorData = any, Result = any>(
    input: HttpClientPostInput,
  ): Promise<RequestOutput<ErrorData, Result>>;

  /**
   * used to make Put HTTP requests
   * @param input HttpClientPutInput
   */
  put<ErrorData = any, Result = any>(
    input: HttpClientPutInput,
  ): Promise<RequestOutput<ErrorData, Result>>;

  /**
   * used to make Delete HTTP requests
   * @param input HttpClientDeleteInput
   */
  delete<ErrorData = any, Result = any>(
    input: HttpClientDeleteInput,
  ): Promise<RequestOutput<ErrorData, Result>>;
}
