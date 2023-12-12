import User from './Aggregate';

export interface UserRepository {
  /**
   * @param as AbortSignal
   * @throws Error
   */
  GetProfile(as: AbortSignal): Promise<User | null>;

  /**
   * @param as AbortSignal
   * @param input UserAggregate
   * @throws Error
   */
  UpdateProfile(as: AbortSignal, input: User): Promise<true | null>;
}
