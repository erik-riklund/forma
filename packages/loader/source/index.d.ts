/**
 * Represents a template loader adapter.
 */
export interface ILoadAdapter
{
  /**
   * Loads a template using the adapter.
   * 
   * @param identifier - The identifier of the template to load.
   * @returns A promise that resolves to the loaded template as a string.
   * @throws Will throw an error if the adapter fails to load the template.
   */
  load: (identifier: string) => Promise<string>;
}