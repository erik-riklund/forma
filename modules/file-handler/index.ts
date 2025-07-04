/*
 * Copyright (C) 2025 Erik Riklund (Gopher)
 * <https://github.com/erik-riklund>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { makeFileObject } from './file'
import { makeFolderObject } from './folder'

/**
 * Creates a file system handler object that uses the provided
 * file system object to interact with files and folders.
 */
export const makeFileSystemHandler = (fileSystem: FileHandler.FileSystem) =>
{
  return {
    /**
     * Creates a new file object for the specified path.
     */
    file: (path: string) => makeFileObject(path, fileSystem),

    /**
     * Creates a new folder object for the specified path.
     */
    folder: (path: string) => makeFolderObject(path, fileSystem)
  }
}