import { makeFileObject } from './file'
import { makeFolderObject } from './folder'

declare global
{
  namespace FileHandler
  {
    /**
     * Represents a subset of the Node.js 'fs' module,
     * providing core file system functionalities.
     */
    type FileSystem = Pick<
      typeof import('node:fs'),

      | 'existsSync'
      | 'mkdirSync'
      | 'readFileSync'
      | 'readdirSync'
      | 'rmSync'
      | 'statSync'
      | 'writeFileSync'
    >;

    /**
     * Represents a file object created by the `makeFileObject` function.
     */
    type FileObject = ReturnType<typeof makeFileObject>;

    /**
     * Represents a folder object created by the `makeFolderObject` function.
     */
    type FolderObject = ReturnType<typeof makeFolderObject>;
  }
}