import { compile } from '-';
import { it, expect } from 'bun:test';

it('should render a component with an attribute',
  () =>
  {
    const component = '<h1>Hello {{ name }}</h1>';
    const template = '<component test name="world"></component>';
    const renderFunction = compile.toFunction(template, { test: component });

    expect(renderFunction()).toBe('<h1>Hello world</h1>');
  }
);

it('should render a component with an implicit attribute',
  () =>
  {
    const article = '<list articles as="article"><h1>{{:article.title}}</h1></list>';
    const template = '<component article ~articles></component>';
    const renderFunction = compile.toFunction(template, { article });

    const articles = [{ title: 'Article 1' }, { title: 'Article 2' }];
    expect(renderFunction({ articles })).toBe('<h1>Article 1</h1><h1>Article 2</h1>');
  }
);

it('should render a component with an implicit complex attribute',
  () =>
  {
    const user = 'Hello {{name}}!';
    const template = '<component user ~user.name></component>';
    const renderFunction = compile.toFunction(template, { user });

    expect(renderFunction({ user: { name: 'John' } })).toBe('Hello John!');
  }
);

it('should render a self-closing component',
  () =>
  {
    const component = '<h1>Hello {{name}}</h1>';
    const template = '<component test name="world" />';
    const renderFunction = compile.toFunction(template, { test: component });

    expect(renderFunction()).toBe('<h1>Hello world</h1>');
  }
);

it('should render components with block content',
  () =>
  {
    const component = '<h1>News</h1>{{@children}}';
    const template = '<component test>Forma is taking shape!</component>';
    const renderFunction = compile.toFunction(template, { test: component });

    expect(renderFunction()).toBe('<h1>News</h1>Forma is taking shape!');
  }
);

it('should render the block content twice',
  () =>
  {
    const component = '{{@ children }}{{@children}}';
    const template = '<component test>Forma is taking shape!</component>';
    const renderFunction = compile.toFunction(template, { test: component });

    expect(renderFunction()).toBe('Forma is taking shape!'.repeat(2));
  }
);

it('should render a component recursively',
  () =>
  {
    const createNodes = (
      labelPrefix: string, depth = 3, breadth = 3, level = 1): any[] =>
    {
      if (depth === 0) return [];

      return Array.from({ length: breadth }, (_, i) =>
      {
        const label = `${ labelPrefix }.${ i + 1 }`;
        return {
          label: `Node ${ label }`,
          children: createNodes(label, depth - 1, breadth, level + 1)
        };
      });
    };

    const node = '<h3>{{ label }}</h3><ul><li><list children as="child">' +
      '<component self label={{:child.label}} children={{&:child.children}} /></list></li></ul>';

    const renderFunction = compile.toFunction(node, undefined, { recursive: true });
    const result = renderFunction({ label: 'Node 1', children: createNodes('1', 2, 3) });

    expect(result).toContain('<h3>Node 1</h3>');
    expect(result).toContain('<h3>Node 1.3.3</h3>');
  }
);

it('should render a recursive dependency',
  () =>
  {
    const createNodes = (
      labelPrefix: string, depth = 3, breadth = 3, level = 1): any[] =>
    {
      if (depth === 0) return [];

      return Array.from({ length: breadth }, (_, i) =>
      {
        const label = `${ labelPrefix }.${ i + 1 }`;
        return {
          label: `Node ${ label }`,
          children: createNodes(label, depth - 1, breadth, level + 1)
        };
      });
    };

    const tree = '<component node ~label ~children />';
    const node = '<h3>{{ label }}</h3><ul><li><list children as="child">' +
      '<component self label={{:child.label}} children={{&:child.children}} /></list></li></ul>';

    const nodeComponent = compile.toString(node, undefined, { helpers: false, recursive: true });
    const renderFunction = compile.toFunction(tree, { node: nodeComponent });
    const result = renderFunction({ label: 'Node 1', children: createNodes('1', 2, 3) });

    expect(result).toContain('<h3>Node 1</h3>');
    expect(result).toContain('<h3>Node 1.3.3</h3>');
  }
);