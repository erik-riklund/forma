import type {
  Dependencies,
  Element,
  RenderFunction,
  Template
} from 'types';

/**
 * ?
 */
const elements: Record<string, Element> =
{
  /**
   * ?
   */
  children:
  {
    pattern: /\{\{@\s*children\s*\}\}/gs, replacement: `\${v(self.__children)||''}`
  },

  /**
   * ?
   */
  variable:
  {
    pattern: /(\{\{?)(:)?\s*(\w+(?:\.\w+)*)\s*(?:->\s*([^\}]+)\s*)?\}\}?/gs,

    replacement: (_, ...[braces, scope, name, value]) =>
    {
      const path = name.replaceAll(`.`, `?.`);
      const prefix = scope === ':' ? '' : 'self.';

      if (braces === '{{')
      {
        const defaultValue = value?.replaceAll(`'`, `\\'`).trim() || '';

        return `\${v(${ prefix }${ path })||'${ defaultValue }'}`;
      }
      else
      {
        return `v(${ prefix }${ path })`; // raw value.
      }
    }
  },

  /**
   * ?
   */
  component:
  {
    pattern: /<component\s+(\w+)(?:\s+([^>]+))?>/gs,

    replacement: (_, ...[name, attributes]) =>
    {
      const context: string[] = [];
      const properties = attributes?.matchAll(/(?<=^|\s)([a-z-]+)="([^"]+)"/gs);

      if (properties)
      {
        for (const property of properties)
        {
          const [name, value] = property.slice(1, 3);
          context.push(`${ name }:${ value.startsWith('v(') ? value : `'${ value }'` }`);
        }
      }

      context.push(`__children:()=>\``);
      return `\${__${ name }({${ context.join(',') }`;
    }
  },

  /**
   * ?
   */
  componentEnd:
  {
    pattern: /<\/component>/gs, replacement: '`},self)}'
  },

  /**
   * ?
   */
  list:
  {
    pattern: /<(reverse-)?list\s+(\w+)\s+as="(\w+)">/gs,

    replacement: (_, ...[prefix, source, variable]) =>
    {
      const reverse = prefix === 'reverse-' ? '.reverse()' : '';
      return `\${(v(self.${ source })||[])${ reverse }.map(${ variable }=>\``;
    }
  },

  /**
   * ?
   */
  listEnd:
  {
    pattern: /<\/(?:reverse-)?list>/gs, replacement: `\`).join('')}`
  },

  /**
   * ?
   */
  slot:
  {
    pattern: /<slot\s+(\w+)>/gs, replacement: `\${v(parent.__slot_$1)||\``
  },

  /**
   * ?
   */
  slotEnd:
  {
    pattern: /<\/slot>/gs, replacement: '`}'
  },

  /**
   * ?
   */
  render:
  {
    pattern: /<render\s+slot="(\w+)">/gs,
    replacement: `\${(()=>{self.__slot_$1=()=>\``
  },

  /**
   * ?
   */
  renderEnd:
  {
    pattern: /<\/render>/gs, replacement: `\`})()||''}`
  }
};

/**
 * ?
 */
const parseElements = (template: Template): Template =>
{
  // block attempts to break out of the template
  template = template.replaceAll(/\$(?=\{)/gs, '\\$');

  Object.values(elements).forEach(
    (element) =>
    {
      const { pattern, replacement } = element;
      template = template.replaceAll(pattern,
        replacement as (...args: string[]) => string
      );
    }
  );

  return template;
};

/**
 * ?
 */
const compileDependencies = (dependencies: Dependencies): string =>
{
  const result = Object.entries(dependencies).map(
    ([name, template]) => `var __${ name }=${ compile.toString(template) };`, ''
  );

  return result.join('');
};

/**
 * ?
 */
const parseSlots = (template: Template): string =>
{
  const slots = template.matchAll(/<slot\s+(\w+)>/gs);

  return Array.from(slots.map(([, name]) => `'${ name }'`)).join(',');
};

/**
 * ?
 */
const compileTemplate = (
  template: Template, dependencies: Dependencies = {}): string =>
{
  let body =
    `self=self||{};parent=parent||{};` +
    `self.__slots=[${ parseSlots(template) }];` +
    `var v=(t)=>typeof t==='function'?t():t;` +
    compileDependencies(dependencies) +
    `if(self.__slots.length){self.__children&&self.__children()}` +
    `return \`${ parseElements(template) }\`;`;

  return body;
};

/**
 * ?
 */
export const compile =
{
  /**
   * ?
   */
  toFunction: (template: Template, dependencies: Dependencies = {}): RenderFunction =>
  {
    try
    {
      const body = compileTemplate(template, dependencies);
      return new Function('self', 'parent', body) as RenderFunction;
    }

    catch (error)
    {
      console.error(error);
      return new Function('self', 'parent', `return \`${ error }\`;`) as RenderFunction;
    }
  },

  /**
   * ?
   */
  toString: (template: Template, dependencies: Dependencies = {}): string =>
  {
    return `(self,parent)=>{${ compileTemplate(template, dependencies) }}`;
  }
};