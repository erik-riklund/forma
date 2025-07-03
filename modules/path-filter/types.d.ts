import { makePathFilter } from '.'

declare global
{
  namespace PathFilter
  {
    /**
     * Represents a function that filters an array of file paths based
     * on a precompiled pattern, returning only the entries that match.
     */
    type Instance = ReturnType<typeof makePathFilter>;
  }
}