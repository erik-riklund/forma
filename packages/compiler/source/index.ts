import type {
  Dependencies,
  Element,
  RenderFunction,
  Template
} from 'types';

/**
 * Defines all recognized template syntax elements and their transformation rules.
 * Each entry includes a RegExp to match and a corresponding replacement.
 * These rules are applied to the template to transform custom syntax into valid JS code.
 */
const elements: Record<string, Element> =
{
  /**
   * Handles block content insertion (`{{@ children }}`)
   */
  children: { pattern: /\{\{\s*@\s*children\s*\}\}/gs, replacement: `\${v(self.__children)||''}` },

  /**
   * Handles variable interpolation and fallback values,
   * with support for modifiers like raw output (!) and local scope (:).
   */
  variable:
  {
    pattern: /(\{\{?)\s*(!{0,1}:{0,1})?\s*(\w+(?:\.\w+)*)\s*(?:->\s*([^\}]+)\s*)?\}\}?/gs,

    replacement: (_, ...[braces, scope, name, value]) =>
    {
      const path = name.replaceAll(`.`, `?.`);
      const prefix = scope?.endsWith(':') ? '' : 'self.';

      if (braces === '{{')
      {
        const useEncoder = !scope?.startsWith('!');
        const before = useEncoder ? `e(` : '';
        const after = useEncoder ? ')' : '';

        const defaultValue = value?.replaceAll(`'`, `\\'`).trim() || '';
        return `\${${ before }v(${ prefix }${ path })||'${ defaultValue }'${ after }}`;
      }
      else
      {
        const defaultValue = value || null; // non-string values (marked by single braces).
        return `v(${ prefix }${ path })${ defaultValue ? `||${ defaultValue }` : '' }`;
      }
    }
  },

  /**
   * Handles conditional rendering (`<if>`, `<else-if>`, `<else>`, `</if>`)
   */
  condition:
  {
    pattern: /<(else-)?if\s+(?:(not)\s+)?condition="\s*(:)?\s*(\w+)\s*">/gs,

    replacement: (_, ...[prefix, not, scope, condition]) =>
    {
      const modifier = not ? '!' : '';
      const elseIf = prefix === 'else-';
      const variable = (scope === ':' ? '' : 'self.') + condition.replace('.', '?.');

      return `${ !elseIf ? '${' : '\`||' }${ modifier }r(${ variable })&&\``;
    }
  },

  elseBlock: { pattern: /<else>/gs, replacement: `\`||\`` },
  endCondition: { pattern: /<\/if>/gs, replacement: `\`||''}` },

  /**
   * Allows for rendering of components with attributes and children.
   */
  component:
  {
    pattern: /<component\s+(\w+)(?:\s+([^>]+))?>/gs,

    replacement: (_, ...[name, attributes]) =>
    {
      const context: string[] = [];
      const properties = attributes?.matchAll(/(?<=^|\s)([a-z-]+)="([^"]+)"/gs);
      const closed = attributes?.endsWith('/');

      if (properties)
      {
        for (const property of properties)
        {
          const [name, value] = property.slice(1, 3);
          context.push(`${ name }:${ value.startsWith('v(') ? value : `'${ value }'` }`);
        }
      }

      context.push(`__children:()=>\``);
      return `\${__${ name }({${ context.join(',') }${ closed ? '`},self)}' : '' }`;
    }
  },

  componentEnd: { pattern: /<\/component>/gs, replacement: '`},self)}' },

  /**
   * List rendering block (`<list>` and `<reverse-list>`).
   * This allows for iterating over arrays and rendering their items.
   */
  list:
  {
    pattern: /<(reverse-)?list\s+(\w+)\s+as="\s*(\w+)\s*">/gs,

    replacement: (_, ...[prefix, source, variable]) =>
    {
      const reverse = prefix === 'reverse-' ? '.reverse()' : '';
      return `\${(v(self.${ source })||[])${ reverse }.map(${ variable }=>\``;
    }
  },

  listEnd: { pattern: /<\/(?:reverse-)?list>/gs, replacement: `\`).join('')}` },

  /**
   * Named slot definition (`<slot name>`).
   * This allows for defining reusable content areas within components.
   */
  slot: { pattern: /<slot\s+(\w+)>/gs, replacement: `\${v(parent.__slot_$1)||\`` },
  slotEnd: { pattern: /<\/slot>/gs, replacement: '`}' },

  /**
   * Injection of content into named slots (`<render slot>`).
   * This allows for dynamic content rendering within specific slots.
   */
  render: { pattern: /<render\s+slot="\s*(\w+)\s*">/gs, replacement: `\${(()=>{self.__slot_$1=()=>\`` },
  renderEnd: { pattern: /<\/render>/gs, replacement: `\`})()||''}` },

  /**
   * Conditional rendering block (`<when>`).
   * This allows for conditional rendering based on variable values.
   */
  when:
  {
    pattern: /<when\s+variable="\s*(:)?\s*(\w+)\s*">/gs,

    replacement: (_, ...[scope, variable]) =>
    {
      const prefix = scope === ':' ? '' : 'self.';
      const path = variable.replaceAll('.', '?.');

      return `\${(()=>{var a=${ prefix + path };return `;
    }
  },
  whenEnd: { pattern: /<\/when>/gs, replacement: `'';})()}` },

  /**
   * Case block (`<case>`, `<default>`).
   * This allows for multi-way branching based on a variable's value.
   */
  case:
  {
    pattern: /<case\s+is="\s*(\w+)\s*">/gs,

    replacement: (_, ...[value]) =>
    {
      return `(c(a,'${ value.replaceAll(`'`, `\\'`) }')&&\``;
    }
  },
  default: { pattern: /<default>/gs, replacement: `(\`` },
  caseEnd: { pattern: /<\/(?:case|default)>/gs, replacement: `\`)||` }
};

/**
 * Parses the template string and applies all element transformations.
 * 
 * @param template - The template string to be parsed.
 * @returns The transformed template string with all elements parsed.
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
 * Compiles all dependency templates into render function definitions.
 * 
 * @param dependencies - An object containing dependencies to be compiled.
 * @returns A string containing the compiled dependencies.
 */
const compileDependencies = (dependencies: Dependencies): string =>
{
  const result = Object.entries(dependencies).map(
    ([name, template]) => `var __${ name }=${ compile.toString(template) };`, ''
  );
  return result.join('');
};

/**
 * Extracts named slots from a template for pre-processing.
 * 
 * @param template - The template string to be parsed.
 * @returns A string containing the names of the slots found in the template.
 */
const parseSlots = (template: Template): string =>
{
  const slots = template.matchAll(/<slot\s+(\w+)>/gs);
  return Array.from(slots.map(([, name]) => `'${ name }'`)).join(',');
};

/**
 * Compiles the full template body as a stringified render function.
 * 
 * @param template - The template string to be compiled.
 * @param dependencies - An object containing dependencies to be compiled.
 * @returns A string containing the compiled template body.
 */
const compileTemplate = (
  template: Template, dependencies: Dependencies = {}): string =>
{
  let body =
    `self=self||{};parent=parent||{};` +
    `self.__slots=[${ parseSlots(template) }];` +
    `var v=(t)=>typeof t==='function'?t():t;` +
    `var e=(t)=>t.replaceAll('<','&lt;').replaceAll('>','&gt;');` +
    `var r=(t)=>(t!==false&&t!==null&&t!==undefined);` +
    `var c=(a,b)=>(typeof a==='number'?a===parseInt(b):a===b);` +
    compileDependencies(dependencies) +
    `if(self.__slots.length){self.__children&&self.__children()}` +
    `return \`${ parseElements(template) }\`;`;

  return body;
};

/**
 * * The `compile` API provides methods to compile templates into render functions.
 * * It includes methods to convert templates into both function and string formats.
 */
export const compile =
{
  /**
   * Compiles a template and its optional dependencies into a render function.
   * 
   * @param template - The template string to be compiled.
   * @param dependencies - An object containing dependencies to be compiled.
   * @return A render function that can be used to render the template.
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
   * Compiles a template and its dependencies into a string representation of a render function.
   * 
   * @param template - The template string to be compiled.
   * @param dependencies - An object containing dependencies to be compiled.
   * @return A string representation of the render function.
   */
  toString: (template: Template, dependencies: Dependencies = {}): string =>
  {
    return `(self,parent)=>{${ compileTemplate(template, dependencies) }}`;
  }
};
