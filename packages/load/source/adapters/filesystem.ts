import { readFile } from 'fs/promises';
import type { ILoadAdapter } from 'types';

/**
 * Adapter for loading templates from the filesystem using Bun's file API.
 */
export const fileLoader: ILoadAdapter =
{
  /**
   * Loads a template from the filesystem.
   * 
   * @param path - The path to the template file.
   * @returns A promise that resolves to the contents of the template file.
   * @throws An error if the template file cannot be loaded.
   */
  load: async (path: string): Promise<string> =>
  {
    try
    {
      return await readFile(path, 'utf-8');
    }

    catch (error)
    {
      throw new Error(`Failed to load template: "${ path }"`);
    }
  }
};