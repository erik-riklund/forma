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

it('should render context variables with default values',
  () =>
  {
    const template = 'Hello {{ user.name -> John }}';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction()).toBe('Hello John');
  }
);

it('should render components',
  () =>
  {
    const component = '<h1>Hello {{ name }}</h1>';
    const template = '<component test name="world"></component>';
    const renderFunction = compile.toFunction(template, { test: component });

    expect(renderFunction()).toBe('<h1>Hello world</h1>');
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

it('should render components with block content',
  () =>
  {
    const component = '<h1>News</h1>{{@ children}}';
    const template = '<component test>Forma is taking shape!</component>';
    const renderFunction = compile.toFunction(template, { test: component });

    expect(renderFunction()).toBe('<h1>News</h1>Forma is taking shape!');
  }
);

it('should render a list passed to a nested component',
  () =>
  {
    const userList = '<ul><list users as="user"><li>{{: user.name }}</li></list></ul>';
    const template = '<component userList users="{ users }"></component>';
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

    console.log(compile.toString(template, { layout }));

    expect(renderFunction()).toBe('<div>Hello world</div>');
  }
);