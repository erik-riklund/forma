import { useLoader } from '-';
import { it, expect } from 'bun:test';

it('should throw an error if the provided adapter is not an object',
  async () =>
  {
    const loader = useLoader('not an object' as any);

    expect(async () => await loader.fetchTemplate('template path'))
      .toThrow('Invalid adapter provided to the template loader.');
  }
);

it('should throw an error if the provided adapter does not have a `load` method',
  () =>
  {
    const loader = useLoader({} as any);

    expect(async () => await loader.fetchTemplate('template path'))
      .toThrow('Invalid adapter provided to the template loader.');
  }
);

it("should call the adapter's `load` method when fetching a template",
  async () =>
  {
    const adapter = {
      load: async (path: string): Promise<string> => 'template content'
    };

    const loader = useLoader(adapter);
    const result = await loader.fetchTemplate('template path');

    expect(result).toBe('template content');
  }
);