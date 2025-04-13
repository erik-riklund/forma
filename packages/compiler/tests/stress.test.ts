import { compile } from '-';
import { it, expect } from 'bun:test';

it.skip('should handle 1000 simple components',
  () =>
  {
    const components = Object.fromEntries(
      Array.from({ length: 1000 }, (_, i) =>
        [`component${ i }`, `<h1>Hello says component ${ i }</h1>`]
      )
    );
    const template = Array.from({ length: 1000 },
      (_, i) => `<component component${ i } />`).join('');

    const expectedResult = Array.from({ length: 1000 },
      (_, i) => `<h1>Hello says component ${ i }</h1>`).join('');

    const renderFunction = compile.toFunction(template, { ...components });
    expect(renderFunction()).toBe(expectedResult);
  }
);

it.skip('should handle 1000 components, each with two dependencies',
  () =>
  {
    const dependencies = {
      user: '<h1>Hello {{ name }}</h1>',
      avatar: '<img src="{{ file }}">',
    };
    const components = Object.fromEntries(
      Array.from({ length: 1000 }, (_, i) =>
        [`component${ i }`, `<component user ~name /><component avatar ~file />`]
      )
    );

    const template = Array.from({ length: 1000 },
      (_, i) => `<component component${ i } ~name ~file />`).join('');
    const expectedResult = Array.from({ length: 1000 },
      (_, j) => '<h1>Hello John</h1><img src="test.png">').join('');

    const renderFunction = compile.toFunction(template, { ...components, ...dependencies });
    expect(renderFunction({ name: 'John', file: 'test.png' })).toBe(expectedResult);
  }
);
