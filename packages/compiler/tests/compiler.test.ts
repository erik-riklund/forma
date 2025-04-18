import { compile } from '-';
import { it, expect } from 'bun:test';

it('should return a function that returns a string',
  () =>
  {
    const template = 'Hello world';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction).toBeTypeOf('function');
    expect(renderFunction()).toBe(template);
  }
);

it('should throw an error on invalid dependencies',
  () =>
  {
    const template = 'Hello world';

    // @ts-expect-error - we are testing invalid dependencies.
    expect(() => compile.toFunction(template, { invalid: compile.toFunction(template) }))
      .toThrow('Invalid template type for dependency (invalid). Expected a raw or precompiled string.');

    expect(() => compile.toFunction(template, { valid: template })).not.toThrow();
  }
);

it.todo('should return a string that contains the template',
  () =>
  {
    const template = compile.toString('Hello world');
    const result =
      '(self,parent)=>{self=self||{};parent=parent||{};self.__slots=[];const v=(t)=>typeof t===' +
      '\'function\'?t():t;const e=(t)=>typeof t===\'string\'&&t.replaceAll(\'<\',\'&lt;\').replaceAll' +
      '(\'>\',\'&gt;\')||t;const r=(t)=>t!==false&&t!==null&&t!==undefined;const c=(a,b)=>typeof a===' +
      '\'number\'?a===parseInt(b):a===b;if(self.__children){self.__children_r=self.__children()}return `Hello world`;}';

    expect(template).toEqual(result);
  }
);

it('should block attempts to break out of the template',
  () =>
  {
    const template = 'Hello ${(() => {throw new Error("Attempted to break out of the template");})()}';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction()).toBe(template);
  }
);