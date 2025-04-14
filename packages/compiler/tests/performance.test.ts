import { compile } from '-';
import { it, expect } from 'bun:test';

it.skip('compiles and renders a simple component 1,000 times',
  () =>
  {
    let count = 1;
    let success = true;

    while (success && count++ <= 1000)
    {
      const template = '<component test />';
      const component = '<h1>Hello says component</h1>';

      const renderFunction = compile.toFunction(template, { test: component });
      success = (renderFunction() === '<h1>Hello says component</h1>');
    }

    expect(success).toBe(true);
  }
);

it.skip('renders a precompiled component 100,000 times',
  () =>
  {
    const template = '<component test ~count />';
    const component = '<h1>Hello says component #{{ count }}</h1>';
    const renderFunction = compile.toFunction(template, { test: component });

    let count = 1;
    let success = true;

    while (success && count++ <= 100000)
    {
      success = (renderFunction({ count }) ===
        `<h1>Hello says component #${ count }</h1>`);
    }

    expect(success).toBe(true);
  }
);

it.skip('compiles and renders a component with two dependencies 1,000 times',
  () =>
  {
    let count = 1;
    let success = true;

    while (success && count++ <= 1000)
    {
      const dependencies = {
        user: '<h1>Hello {{ name }}</h1>',
        avatar: '<img src="{{ file }}">',
      };
      const template = '<component user ~name /><component avatar ~file />';
      const renderFunction = compile.toFunction(template, dependencies);

      success = (renderFunction({ name: 'John', file: 'test.png' })
        === '<h1>Hello John</h1><img src="test.png">');
    }

    expect(success).toBe(true);
  }
);

it.skip('renders a list with 100 items using a precompiled component 1000 times',
  () =>
  {
    const template = '<component test ~items />';
    const component = '<ul><list items as="item"><li>{{: item }}</li></list></ul>';
    const renderFunction = compile.toFunction(template, { test: component });
    const items = Array.from({ length: 100 }, (_, i) => `hello world`);

    let count = 1;
    let success = true;

    while (success && count++ <= 1000)
    {
      success = renderFunction({ items }) ===
        `<ul>${ '<li>hello world</li>'.repeat(100) }</ul>`;
    }

    expect(success).toBe(true);
  }
);

it.skip('compiles and renders a component and its 100 dependencies 100 times',
  () =>
  {
    let count = 1;
    let success = true;

    const dependencies = Object.fromEntries(
      Array.from({ length: 100 }, (_, i) => [`test${ i }`, `<h1>Hello {{ name }}</h1>`])
    );

    while (success && count++ <= 100)
    {
      const template = Array.from({ length: 100 }, (_, i) => `<component test${ i } ~name />`).join('');
      const renderFunction = compile.toFunction(template, dependencies);

      success = renderFunction({ name: 'John' }) ===
        Array.from({ length: 100 }, (_, i) => `<h1>Hello John</h1>`).join('');
    }

    expect(success).toBe(true);
  }
);

it('renders a deep tree (111,111 nodes) using a recursive component',
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
    const result = renderFunction({ label: 'Node 1', children: createNodes('1', 5, 10) });

    expect(result).toContain('<h3>Node 1</h3>');
    expect(result).toContain('<h3>Node 1.10.10.10.10.10</h3>');
  }
);
