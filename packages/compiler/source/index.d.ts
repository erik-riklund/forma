/**
 * Represents a syntax element handled by the compiler.
 * Each element consists of a `RegExp` pattern and a corresponding replacement string or function.
 * Used internally to transform custom template syntax into valid JavaScript code.
 */
export interface Element
{
  pattern: RegExp;
  replacement: string | (
    (substring: string, ...args: string[]) => string
  );
}

/**
 * Optional configuration settings for the compiler.
 */
export interface Options
{
  /**
   * Specifies whether a component is able to call itself recursively.
   */
  recursive?: boolean;
}

/**
 * A generic template context object passed to render functions.
 * Typically holds all the data used during rendering (e.g., variables, props).
 */
export type Context = Record<string, unknown>;

/**
 * A collection of named component templates passed to the compiler.
 * Each key represents a component name, and each value is a template string.
 */
export type Dependencies = Record<string, Template>;

/**
 * A compiled render function returned by the compiler.
 *
 * @param self - The local rendering context for the current template.
 * @param parent - The parent context, used to resolve named slots and inherited data.
 * @returns The final rendered HTML string.
 */
export type RenderFunction = (self?: Context, parent?: Context) => string;

/**
 * A string-based template to be compiled into a render function.
 */
export type Template = string;