export type OAuthConfig = {};

export type GetOAuthConfigOutput = OAuthConfig | null;

export interface RemoteConfig {
  GetOAuthConfig(): Promise<GetOAuthConfigOutput>;
}
