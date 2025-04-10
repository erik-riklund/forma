/**
 * ?
 */
export interface Element
{
  pattern: RegExp;
  replacement: string | (
    (substring: string, ...args: string[]) => string
  );
}

/**
 * ?
 */
export type Context = Record<string, unknown>;

/**
 * ?
 */
export type Dependencies = Record<string, Template>;

/**
 * ?
 * 
 * @param self - ?
 * @param parent - ?
 */
export type RenderFunction = (self?: Context, parent?: Context) => string;

/**
 * ?
 */
export type Template = string;