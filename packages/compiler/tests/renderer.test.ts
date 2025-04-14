import { compile } from '-';
import { it, expect } from 'bun:test';

it('should render flat context variables',
  () =>
  {
    const template = 'Hello {{ name }}';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ name: 'John' })).toBe('Hello John');
  }
);

it('should render nested context variables',
  () =>
  {
    const template = 'Hello {{ user.name }}';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ user: { name: 'John' } })).toBe('Hello John');
  }
);

it('should render context variables with default values',
  () =>
  {
    const template = '<img src="{{ source -> https://example.com/default.jpg }}">';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ source: 'https://example.com/image.jpg' }))
      .toBe('<img src="https://example.com/image.jpg">');

    expect(renderFunction({})).toBe('<img src="https://example.com/default.jpg">');
  }
);

it('should render context variables with functions',
  () =>
  {
    const template = 'Hello {{ user.name }}';
    const context = { user: { name: () => 'John' } };
    const renderFunction = compile.toFunction(template);

    expect(renderFunction(context)).toBe('Hello John');
  }
);

it('should HTML encode context variables by default',
  () =>
  {
    const template = 'Hello {{ name }}';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ name: '<b>John</b>' })).toBe('Hello &lt;b&gt;John&lt;/b&gt;');
  }
);

it('should not HTML encode context variables with modifier',
  () =>
  {
    const template = 'Hello {{! name }}';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ name: '<b>John</b>' })).toBe('Hello <b>John</b>');
  }
);

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
    const component = '<list articles as="article"><h1>{{: article.title }}</h1></list>';
    const template = '<component article ~articles></component>';
    const renderFunction = compile.toFunction(template, { article: component });

    const articles = [{ title: 'Article 1' }, { title: 'Article 2' }];
    expect(renderFunction({ articles })).toBe('<h1>Article 1</h1><h1>Article 2</h1>');
  }
);

it('should render a self-closing component',
  () =>
  {
    const component = '<h1>Hello {{ name }}</h1>';
    const template = '<component test name="world" />';
    const renderFunction = compile.toFunction(template, { test: component });

    expect(renderFunction()).toBe('<h1>Hello world</h1>');
  }
);

it('should render components with block content',
  () =>
  {
    const component = '<h1>News</h1>{{@ children}}';
    const template = '<component test>Forma is taking shape!</component>';
    const renderFunction = compile.toFunction(template, { test: component });

    expect(renderFunction()).toBe('<h1>News</h1>Forma is taking shape!');
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
      '<component self label="{:child.label}" children="{:child.children}" /></list></li></ul>';

    const renderFunction = compile.toFunction(node, undefined, { recursive: true });
    const result = renderFunction({ label: 'Node 1', children: createNodes('1', 2, 3) });

    expect(result).toContain('<h3>Node 1</h3>');
    expect(result).toContain('<h3>Node 1.3.3</h3>');
  }
);

it('should render a list',
  () =>
  {
    const context = { users: [{ name: 'John' }, { name: 'Jane' }] };
    const template = '<ul><list users as="user"><li>{{: user.name }}</li></list></ul>';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction(context)).toBe('<ul><li>John</li><li>Jane</li></ul>');
  }
);

it('should render a list in reverse',
  () =>
  {
    const context = { users: [{ name: 'John' }, { name: 'Jane' }] };
    const template = '<ul><reverse-list users as="user"><li>{{: user.name }}</li></reverse-list></ul>';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction(context)).toBe('<ul><li>Jane</li><li>John</li></ul>');
  }
);

it('should render a list passed to a nested component',
  () =>
  {
    const template = '<component userList users="{ users }"></component>';
    const userList = '<ul><list users as="user"><li>{{: user.name }}</li></list></ul>';
    const renderFunction = compile.toFunction(template, { userList });

    const context = { users: [{ name: 'John' }, { name: 'Jane' }] };
    expect(renderFunction(context)).toBe('<ul><li>John</li><li>Jane</li></ul>');
  }
);

it('should render a nested component from inside a list',
  () =>
  {
    const userList = '<li>{{ user.name }}</li>';
    const template = '<ul><list users as="user"><component userList user="{: user }"></component></list></ul>';
    const renderFunction = compile.toFunction(template, { userList });

    const context = { users: [{ name: 'John' }, { name: 'Jane' }] };
    expect(renderFunction(context)).toBe('<ul><li>John</li><li>Jane</li></ul>');
  }
);

it('should render the default slot content',
  () =>
  {
    const layout = '<div><slot main>No content available</slot></div>';
    const template = '<component layout>Hello?</component>';
    const renderFunction = compile.toFunction(template, { layout });

    expect(renderFunction()).toBe('<div>No content available</div>');
  }
);

it('should render the named slot content',
  () =>
  {
    const layout = '<div><slot main>No content available</slot></div>';
    const template = '<component layout><render slot="main">Hello world</render></component>';
    const renderFunction = compile.toFunction(template, { layout });

    expect(renderFunction()).toBe('<div>Hello world</div>');
  }
);

it('should render the named slot and the block content',
  () =>
  {
    const layout = '<h1><slot title>No title available</slot></h1><p>{{@ children }}</p>';
    const template = '<component layout><render slot="title">Hello world</render>... and then some raw text.</component>';
    const renderFunction = compile.toFunction(template, { layout });

    expect(renderFunction()).toBe('<h1>Hello world</h1><p>... and then some raw text.</p>');
  }
);

it('should not render the conditional block',
  () =>
  {
    const template = '<if condition="test">Hello world</if>';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ test: false })).toBe('');
  }
);

it('should render the conditional block',
  () =>
  {
    const template = '<if condition="test">Hello world</if>';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ test: true })).toBe('Hello world');
  }
);

it('should not render the conditional block (with modifier)',
  () =>
  {
    const template = '<if not condition="test">Hello world</if>';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ test: true })).toBe('');
  }
);

it('should render the conditional block (with modifier)',
  () =>
  {
    const template = '<if not condition="test">Hello world</if>';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ test: false })).toBe('Hello world');
  }
);

it('should render the else-if block',
  () =>
  {
    const template = '<if condition="test">Hello<else-if condition="test2">Goodbye</if>';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ test: false, test2: true })).toBe('Goodbye');
  }
);

it('should render the else block',
  () =>
  {
    const template = '<if condition="test">Hello<else>Goodbye</if> world';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ test: false })).toBe('Goodbye world');
  }
);

it('should render the correct switch case block (strings)',
  () =>
  {
    const template = '<when variable="test"><case is="a">A</case>' +
      '<case is="b">B</case><default>Default</default></when>';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ test: 'a' })).toBe('A');
    expect(renderFunction({ test: 'b' })).toBe('B');
    expect(renderFunction({ test: 'c' })).toBe('Default');
  }
);

it('should render the correct switch case block (numbers)',
  () =>
  {
    const template = '<when variable="test"><case is="1">A</case>' +
      '<case is="2">B</case><default>Default</default></when>';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ test: 1 })).toBe('A');
    expect(renderFunction({ test: 2 })).toBe('B');
    expect(renderFunction({ test: 3 })).toBe('Default');
  }
);