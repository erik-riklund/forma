/**
 * ?
 */
export const structure: Record<string, any> =
{
  app:
  {
    assets:
    {
      images: {
        '.gitkeep': './scaffold/.gitkeep'
      },

      styles: {
        '.gitkeep': './scaffold/.gitkeep'
      }
    },

    routes:
    {
      api: {
        '.gitkeep': './scaffold/.gitkeep'
      },

      '-pages': {
        '.gitkeep': './scaffold/.gitkeep'
      }
    },

    ui: {
      '.gitkeep': './scaffold/.gitkeep'
    },

    'index.ts': './scaffold/app/index.ts',
  },

  core:
  {
    'index.js': './packages/stack/dist/index.js',
    'routes.ts': './scaffold/core/routes.ts',
    'templates.ts': './scaffold/core/templates.ts',
    'types.d.ts': './scaffold/core/types.d.ts',
  },

  '.vscode': {
    'settings.json': './scaffold/.vscode/settings.json'
  },

  'package.json': './scaffold/package.json',
  'tsconfig.json': './scaffold/tsconfig.json'
};