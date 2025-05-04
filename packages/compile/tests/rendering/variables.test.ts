import { compile } from '-';
import { it, expect } from 'bun:test';

it('should render the context variable',
  () =>
  {
    const template = 'Hello {{ name }}';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ name: 'John' })).toBe('Hello John');
  }
);

it('should render the nested context variable',
  () =>
  {
    const template = 'Hello {{ user.name }}';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ user: { name: 'John' } })).toBe('Hello John');
  }
);

it('should handle default values for variables',
  () =>
  {
    const template = '<img src="{{ source -> "https://example.com/default.jpg" }}">';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ source: 'https://example.com/image.jpg' })).toBe('<img src="https://example.com/image.jpg">');
    expect(renderFunction({})).toBe('<img src="https://example.com/default.jpg">');
  }
);

it('should render context variables with multiple default values',
  () =>
  {
    const template = 'Hello {{ name -> alias -> "friend" }}!';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ name: 'John' })).toBe('Hello John!');
    expect(renderFunction({ alias: 'Doe' })).toBe('Hello Doe!');
    expect(renderFunction({})).toBe('Hello friend!');
  }
);

it('should render the fallback context variable with missing local variable',
  () =>
  {
    const template = 'Hello {{ :name -> alias }}!';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ alias: 'John Doe' })).toBe('Hello John Doe!');
  }
);

it('should render a context variable with a function value',
  () =>
  {
    const template = 'Hello {{ user.name }}';
    const context = { user: { name: () => 'John' } };
    const renderFunction = compile.toFunction(template);

    expect(renderFunction(context)).toBe('Hello John');
  }
);

it('should HTML-encode the variable',
  () =>
  {
    const template = 'Hello {{ name }}';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ name: '<b>John</b>' })).toBe('Hello &lt;b&gt;John&lt;/b&gt;');
  }
);

it('should not HTML-encode the variable',
  () =>
  {
    const template = 'Hello {{! name }}';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ name: '<b>John</b>' })).toBe('Hello <b>John</b>');
  }
);

it('should HTML-encode the value returned from the function',
  () =>
  {
    const template = 'Hello {{ name }}';
    const context = { name: () => '<b>John</b>' };
    const renderFunction = compile.toFunction(template);

    expect(renderFunction(context)).toBe('Hello &lt;b&gt;John&lt;/b&gt;');
  }
);

it('should not HTML-encode the value returned from the function',
  () =>
  {
    const template = 'Hello {{! name }}';
    const context = { name: () => '<b>John</b>' };
    const renderFunction = compile.toFunction(template);

    expect(renderFunction(context)).toBe('Hello <b>John</b>');
  }
);
