export {};

declare global
{
  /**
   * Represents a value that could be `undefined`.
   */
  type Optional<T> = T | undefined;

  /**
   * Represents a value that could be `null`.
   */
  type MaybeNull<T> = T | null;

  /**
   * Represents a value that could be a `Promise`.
   */
  type MaybePromise<T> = T | Promise<T>;

  /**
   * Represents a value that could be `void`.
   */
  type MaybeVoid<T> = T | void;
}