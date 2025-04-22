import { compile } from '-';
import { describe, it, expect } from 'bun:test';

describe('conditions',
  () =>
  {
    it('should not render the conditional block',
      () =>
      {
        const template = '<if condition={{test}}>Hello world</if>';
        const renderFunction = compile.toFunction(template);

        expect(renderFunction({ test: false })).toBe('');
      }
    );

    it('should render the conditional block',
      () =>
      {
        const template = '<if condition={{test}}>Hello world</if>';
        const renderFunction = compile.toFunction(template);

        expect(renderFunction({ test: true })).toBe('Hello world');
      }
    );

    it('should not render the conditional block (with modifier)',
      () =>
      {
        const template = '<if not condition={{test}}>Hello world</if>';
        const renderFunction = compile.toFunction(template);

        expect(renderFunction({ test: true })).toBe('');
      }
    );

    it('should render the conditional block (with modifier)',
      () =>
      {
        const template = '<if not condition={{test}}>Hello world</if>';
        const renderFunction = compile.toFunction(template);

        expect(renderFunction({ test: false })).toBe('Hello world');
      }
    );

    it('should render the else-if block',
      () =>
      {
        const template = '<if condition={{test}}>Hello<else-if condition={{test2}}>Goodbye</if>';
        const renderFunction = compile.toFunction(template);

        expect(renderFunction({ test: false, test2: true })).toBe('Goodbye');
      }
    );

    it('should render the else block',
      () =>
      {
        const template = '<if condition={{test}}>Hello<else>Goodbye</if> world';
        const renderFunction = compile.toFunction(template);

        expect(renderFunction({ test: false })).toBe('Goodbye world');
      }
    );

    it('should render nested conditional blocks',
      () =>
      {
        const template = '<if condition={{test}}><if condition={{show}}>Hello</if><else>Goodbye</if> world';
        const renderFunction = compile.toFunction(template);

        expect(renderFunction({ test: true, show: true })).toBe('Hello world');
        expect(renderFunction({ test: false, show: false })).toBe('Goodbye world');
        expect(renderFunction({ test: true, show: false })).toBe(' world');
      }
    );

    it('should render the conditional block when the list is not empty',
      () =>
      {
        const template = '<if condition={{items}}><list items as="item">{{:item.name}}</list></if>';
        const renderFunction = compile.toFunction(template);
        const context = { items: [{ name: 'Item 1' }, { name: 'Item 2' }] };

        expect(renderFunction(context)).toBe('Item 1Item 2');
      }
    );

    it('should not render the conditional block when the list is empty',
      () =>
      {
        const template = '<if condition={{items}}><list items as="item">{{:item.name}}</list><else>No items found</if>';
        const renderFunction = compile.toFunction(template);

        expect(renderFunction({ items: [] })).toBe('No items found');
      }
    );

    it('should render the correct switch case block (strings)',
      () =>
      {
        const template = '<when value-of={{test}}><case is="a">A</case><case is="b">B</case><default>Default</default></when>';
        const renderFunction = compile.toFunction(template);

        expect(renderFunction({ test: 'a' })).toBe('A');
        expect(renderFunction({ test: 'b' })).toBe('B');
        expect(renderFunction({ test: 'c' })).toBe('Default');
      }
    );

    it('should render the correct switch case block (numbers)',
      () =>
      {
        const template = '<when value-of={{test}}><case is="1">A</case><case is="2">B</case><default>Default</default></when>';
        const renderFunction = compile.toFunction(template);

        expect(renderFunction({ test: 1 })).toBe('A');
        expect(renderFunction({ test: 2 })).toBe('B');
        expect(renderFunction({ test: 3 })).toBe('Default');
      }
    );

    it('should render nested switch blocks',
      () =>
      {
        const template = '<when value-of={{a}}><case is="alpha"><when value-of={{b}}><case is="beta">Beta</case><case is="gamma">Gamma</case></when></case><default>Default</default></when>';
        const renderFunction = compile.toFunction(template);

        expect(renderFunction({ a: 'alpha', b: 'gamma' })).toBe('Gamma');
        expect(renderFunction({ a: 'beta', b: 'charlie' })).toBe('Default');
      }
    );
  }
);
