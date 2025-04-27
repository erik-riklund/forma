import type { BunRequest } from 'bun';

/**
 * ?
 */
export enum HttpMethod
{
  /**
   * Used to retrieve a record or a collection of records from the server.
   */
  GET = 'GET',

  /**
   * Sends data to create a new record on the server.
   */
  POST = 'POST',

  /**
   * Sends data to replace an existing record on the server.
   */
  PUT = 'PUT',

  /**
     * Used to partially update an existing record on the server.
     */
  PATCH = 'PATCH',

  /**
   * Used to delete record(s) from the server.
   */
  DELETE = 'DELETE'
}

/**
 * ?
 */
interface Declaration<THandler>
{
  /**
   * ?
   */
  handler: THandler;

  /**
   * ?
   */
  path: string;
}

/**
 * ?
 */
export interface RequestContext
{
  /**
   * ?
   */
  data: Record<string, unknown>;

  /**
   * ?
   */
  request: BunRequest;
}

/**
 * ?
 */
export interface ServerConfig
{
  /**
   * ?
   */
  middlewares: MiddlewareDeclaration[];

  /**
   * ?
   */
  routes: RouteDeclaration[];
}

/**
 * ?
 */
type Handler<TResponse> = (context: RequestContext) => MaybePromise<TResponse>;

/**
 * ?
 */
export type MiddlewareDeclaration = Declaration<MiddlewareHandler>;

/**
 * ?
 */
export type MiddlewareHandler = Handler<MaybeVoid<Response>>;

/**
 * ?
 */
export type RouteDeclaration = Declaration<RouteHandler> & { method: HttpMethod; };

/**
 * ?
 */
export type RouteHandler = Handler<Response>;

/**
 * ?
 */
export type RoutePipelines = Record<string, {
  [key: string]: (request: BunRequest) => Promise<Response>;
}>;