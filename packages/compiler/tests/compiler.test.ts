import { compile } from '-';
import { it, expect } from 'bun:test';

it('should return a function',
  () => expect(compile.toFunction('')).toBeTypeOf('function')
);

it('should return a function that returns a string',
  () =>
  {
    const template = 'Hello world';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction()).toBe(template);
  }
);

it('should return a string that contains the template',
  () =>
  {
    const template = compile.toString('Hello world');
    const result =
      '(self,parent)=>{self=self||{};parent=parent||{};self.__slots=[];var v=(t)=>typeof t===\'function\'?' +
      't():t;var e=(t)=>t.replaceAll(\'<\',\'&lt;\').replaceAll(\'>\',\'&gt;\');var c=(t)=>(t!==false&&t!==' +
      'null&&t!==undefined);if(self.__slots.length){self.__children&&self.__children()}return `Hello world`;}';

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

it('should compile dependencies correctly',
  () =>
  {
    const dependencies = { foo: 'Hello' };
    const template = compile.toString('Hello world', dependencies);
    const result =
      '(self,parent)=>{self=self||{};parent=parent||{};self.__slots=[];var v=(t)=>typeof t===\'function\'?' +
      't():t;var e=(t)=>t.replaceAll(\'<\',\'&lt;\').replaceAll(\'>\',\'&gt;\');var c=(t)=>(t!==false&&t!==' +
      'null&&t!==undefined);var __foo=(self,parent)=>{self=self||{};parent=parent||{};self.__slots=[];var ' +
      'v=(t)=>typeof t===\'function\'?t():t;var e=(t)=>t.replaceAll(\'<\',\'&lt;\').replaceAll(\'>\',\'&gt;\');' +
      'var c=(t)=>(t!==false&&t!==null&&t!==undefined);if(self.__slots.length){self.__children&&self.__children()}' +
      'return `Hello`;};if(self.__slots.length){self.__children&&self.__children()}return `Hello world`;}';

    expect(template).toEqual(result);
  }
);

