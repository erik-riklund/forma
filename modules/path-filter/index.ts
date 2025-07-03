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

/**
 * Creates a function that filters an array of file paths based on
 * the provided pattern, returning only the entries that match.
 */
export const makePathFilter = (pattern: string) =>
{
  const compiledPattern = compilePattern(pattern);

  return (filePaths: string[]) => filePaths.filter((path) => compiledPattern.test(path));
};

/**
 * Compiles the given glob pattern into a regular expression
 * that can be used to match file paths against the pattern.
 */
const compilePattern = (pattern: string) =>
{
  const compiledPattern =
    pattern.replace(/[./]/g, '\\$&')
      .replace(/\*{2}\\\//, '([^/]+\/)*')
      .replace(/(?<![)])\*/, '[^/]+')
      .replace(/\{([^}]+)}/g, (_, group) =>
        `(${group.split(',').map((item: string) => item.trim()).join('|')})`
      );

  return new RegExp(`^${compiledPattern}$`);
};