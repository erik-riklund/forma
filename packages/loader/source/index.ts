import type { ILoadAdapter } from 'types';

/**
 * The module responsible for loading templates. Requires an adapter to be set before use.
 * - The adapter must implement the `ILoadAdapter` interface.
 */
export const useLoader = (adapter: ILoadAdapter) =>
{
  return {
    /**
     * Loads a template using the specified adapter.
     * 
     * @param identifier - The identifier of the template to load.
     * @returns A promise that resolves to the loaded template as a string.
     * @throws Will throw an error if no adapter is set, or if the adapter fails to load the template.
     */
    fetchTemplate: (identifier: string): Promise<string> =>
    {
      if (typeof adapter !== 'object' || typeof adapter.load !== 'function')
      {
        throw new Error('Invalid adapter provided to the template loader.');
      }

      return adapter.load(identifier);
    }
  };
};