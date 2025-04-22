import { compile } from '-';
import { it, expect } from 'bun:test';

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