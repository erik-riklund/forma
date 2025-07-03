import { makeFileObject } from './file'

/**
 * Creates a new folder object for the specified folder path.
 * The object provides methods to interact with the folder and its contents.
 */
export const makeFolderObject = (
  folderPath: string, fileSystem: FileHandler.FileSystem) =>
{
  return {
    /**
     * Returns the path to the folder as it was specified.
     */
    get path () { return folderPath; },

    /**
     * Returns `true` if the folder exists, `false` otherwise.
     */
    get exists ()
    {
      return fileSystem.existsSync(folderPath);
    },

    /**
     * Creates the folder if it does not exist.
     */
    create ()
    {
      if (!this.exists)
      {
        fileSystem.mkdirSync(folderPath, { recursive: true });
      }
    },

    /**
     * Deletes the folder and its contents.
     */
    delete ()
    {
      if (this.exists)
      {
        fileSystem.rmSync(folderPath, { recursive: true, force: true });
      }
    },

    /**
     * Deletes the contents but leaves the folder.
     */
    clear ()
    {
      if (this.exists)
      {
        fileSystem.rmSync(folderPath, { recursive: true, force: true });
        fileSystem.mkdirSync(folderPath, { recursive: true });
      }
    },

    /**
     * Returns a list of the files in the folder. The list can be either flat (default) or
     * populated with subfolders (recursive). Each file name is relative to the folder path.
     */
    read (options = { recursive: false }): string[]
    {
      const fileList = [];

      if (!this.exists)
      {
        // We throw an error instead of returning an empty array
        // to avoid bugs that are hard to trace.

        throw new Error(`Folder "${folderPath}" does not exist.`);
      }

      // The items in the folder are read recursively if the `recursive` option is set to `true`.
      // Each item contains a `name` and a `parentPath` which are used to build its relative path.

      const items = fileSystem.readdirSync(
        folderPath, { withFileTypes: true, ...options }
      );
      const rootFolderPath = folderPath.replace(/^(\.+\/)+/, '/');

      for (const item of items)
      {
        if (item.isFile())
        {
          // Each file path returned in the resulting list is relative to the path of the folder object.
          // The path is normalized to use forward slashes, and then the root folder path is stripped.

          const normalizedPath = item.parentPath.replace(/\\/g, '/');
          const relativePath = (!normalizedPath || normalizedPath === '/')
            ? '' : normalizedPath.slice(rootFolderPath.length + 1);

          fileList.push(relativePath ? `${relativePath}/${item.name}` : item.name);
        }
      }

      return fileList;
    },

    /**
     * Creates a new file object for the specified file name.
     */
    file (fileName: string)
    {
      return makeFileObject(`${folderPath}/${fileName}`, fileSystem);
    }
  };
}