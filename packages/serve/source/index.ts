import type {
  MiddlewareDeclaration,
  MiddlewareHandler,
  RequestContext,
  RouteDeclaration,
  RoutePipelines,
  ServerConfig
} from './types';

import { file, serve } from 'bun';
import { middleware } from './middleware';

/**
 * Creates a server instance using the HTTP server provided by Bun.
 * 
 * @param routes - The routes to be registered.
 * @param middlewares - The middlewares to be applied.
 */
export const useServer = ({ routes, middlewares }: ServerConfig) =>
{
  // handle the static file options.

  serve(
    {
      routes:
      {
        '/assets/*':
        {
          GET: (request) =>
          {
            const url = new URL(request.url);
            const path = url.pathname.replace(/^\/assets\//, '');

            return staticFileResponse(path);
          },
        },

        ...createRoutePipelines(routes, middlewares)
      }
    }
  );
};

/**
 * Creates a mapping of route paths to their respective pipelines.
 * 
 * @param routes - A list of route declarations.
 * @param middlewares - A list of middleware declarations.
 */
const createRoutePipelines = (routes: RouteDeclaration[],
  middlewares: MiddlewareDeclaration[]): RoutePipelines =>
{
  const pipelines: RoutePipelines = {};

  const createMiddlewareStack = (routePath: string) =>
  {
    const stack: MiddlewareHandler[] = [];

    for (const { path, handler } of middlewares)
    {
      if (path === '*' || path === routePath || routePath.startsWith(`${ path }/`))
      {
        stack.push(handler); // the middleware is added to the stack.
      }
    }

    return stack;
  };

  for (const { path, method, handler } of routes)
  {
    const middlewareStack = createMiddlewareStack(path);

    pipelines[path] =
    {
      [method as string]: async (request) =>
      {
        const context: RequestContext = { request, data: {} };

        for (const middleware of middlewareStack)
        {
          const response = await middleware(context);

          if (response instanceof Response)
          {
            return response; // return the intercepted response.
          }
        }

        return await handler(context);
      }
    };
  }

  return pipelines;
};

/**
 * Creates a `Response` object with JSON content and appropriate headers.
 * 
 * @param data - The JSON data to be returned.
 */
export const jsonResponse = (data: unknown) =>
{
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

/**
 * Creates a `Response` object with HTML content and appropriate headers.
 * 
 * @param content - The HTML content to be returned.
 */
export const htmlResponse = (content: string) =>
{
  return new Response(content, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
};

/**
 * Creates a `Response` object that serves a static file.
 * 
 * @param filePath - The path to the static file.
 * @returns `Promise` that resolves to a `Response` object with the requested file,
 *          or a `404` error if the file does not exist.
 */
const staticFileResponse = async (filePath: string) =>
{
  try
  {
    const assetFile = file(`./@app/assets/${ filePath }`);
    const fileExists = await assetFile.exists();

    return new Response(
      fileExists ? assetFile : null, { status: fileExists ? 200 : 404 }
    );
  }
  catch (error)
  {
    return new Response(null, { status: 500 });
  }
};

/**
 * Centralize exports for the server module.
 */
export { middleware };
