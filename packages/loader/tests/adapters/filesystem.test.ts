import { fileLoader } from '-/adapters/filesystem';
import { it, expect, mock, afterEach, spyOn } from 'bun:test';
import type { ILoadAdapter } from 'types';

// mocks

const createLoader = () =>
{
  let _adapter: ILoadAdapter | null = null;

  return {
    setAdapter (adapter: ILoadAdapter)
    {
      _adapter = adapter;
    },

    fetchTemplate (identifier: string): Promise<string>
    {
      return (_adapter as ILoadAdapter).load(identifier);
    }
  };
};

// teardown

afterEach(() => mock.restore());

// tests

it('should throw an error for non-existent file',
  async () =>
  {
    const loader = createLoader();
    loader.setAdapter(fileLoader);

    //@ts-ignore
    spyOn(Bun, 'file').mockReturnValue({
      text: () => { throw new Error('File not found'); }
    });

    expect(loader.fetchTemplate('non-existent-file')).rejects
      .toThrowError('Failed to load template: "non-existent-file"');
  }
);

it('should return the file content',
  () =>
  {
    const loader = createLoader();
    loader.setAdapter(fileLoader);

    const filePath = './tests/target.fml';
    const fileContent = '<h1>Hello world</h1>';

    return expect(loader.fetchTemplate(filePath)).resolves.toEqual(fileContent);
  }
);