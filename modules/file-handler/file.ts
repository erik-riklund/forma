/**
 * Creates a new file object for the specified file path.
 * The object provides methods to interact with the file.
 */
export const makeFileObject = (
  filePath: string, fileSystem: FileHandler.FileSystem) =>
{
  return {
    /**
     * Returns the path to the file as it was specified.
     */
    get path () { return filePath; },

    /**
     * Returns the name of the file (including the extension).
     */
    get name ()
    {
      return filePath.split('/').pop() || '';
    },

    /**
     * Returns the path to the folder that contains the file.
     */
    get folder ()
    {
      return filePath.includes('/') ? filePath.slice(0, filePath.lastIndexOf('/')) : '.';
    },

    /**
     * Returns `true` if the file exists, `false` otherwise.
     */
    get exists ()
    {
      return fileSystem.existsSync(filePath) && fileSystem.statSync(filePath).isFile();
    },

    /**
     * Returns the last modified timestamp of the file in milliseconds.
     * - Returns `-1` if the file does not exist, or is not a file.
     */
    get lastModified ()
    {
      if (!fileSystem.existsSync(filePath))
      {
        return -1; // file does not exist.
      }

      const stats = fileSystem.statSync(filePath);
      return stats.isFile() ? stats.mtimeMs : -1;
    },

    /**
     * Deletes the file if it exists.
     */
    delete ()
    {
      if (!this.exists)
      {
        // We throw an error instead of letting this pass silently
        // to avoid bugs that are hard to trace.

        throw new Error(`File "${filePath}" does not exist.`);
      }

      fileSystem.rmSync(filePath);
    },

    /**
     * Returns the contents of the file as a string.
     * The file is read using the specified encoding (default: `utf8`).
     */
    read (encoding: BufferEncoding = 'utf8')
    {
      if (!this.exists)
      {
        // We throw an error instead of returning an empty string
        // to avoid bugs that are hard to trace.

        throw new Error(`File "${filePath}" does not exist.`);
      }

      return fileSystem.readFileSync(filePath, encoding);
    },

    /**
     * Returns the contents of the file as a JSON object.
     * The file is read using the specified encoding (default: `utf8`).
     */
    readJson (encoding: BufferEncoding = 'utf8')
    {
      return JSON.parse(this.read(encoding));
    },

    /**
     * Writes the provided data (a string) to the file.
     * The file is written using the specified encoding (default: `utf8`).
     */
    write (data: string, encoding: BufferEncoding = 'utf8')
    {
      fileSystem.writeFileSync(filePath, data, encoding);
    },

    /**
     * Writes the provided data (a JSON value) to the file.
     * The file is written using the specified encoding (default: `utf8`).
     */
    writeJson (data: JsonValue, encoding: BufferEncoding = 'utf8')
    {
      this.write(JSON.stringify(data, null, 2), encoding);
    }
  };
}