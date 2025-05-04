import { compile } from '-';
import { it, expect } from 'bun:test';

it('should render a list',
  () =>
  {
    const context = { users: [{ name: 'John' }, { name: 'Jane' }] };
    const template = '<ul><list users as="user"><li>{{: user.name }}</li></list></ul>';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction(context)).toBe('<ul><li>John</li><li>Jane</li></ul>');
  }
);

it('should render a list with destructured variables',
  () =>
  {
    const context = { users: [{ name: 'John', age: 52 }, { name: 'Jane', age: 35 }] };
    const template = '<ul><list users as="name,age"><li>{{:name}} ({{:age}})</li></list></ul>';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction(context)).toBe('<ul><li>John (52)</li><li>Jane (35)</li></ul>');
  }
);

it('should render the fallback content when the list is empty',
  () =>
  {
    const template = '<ul><list users as="user"><li>{{:user.name}}</li><empty><li>No content</li></empty></list></ul>';
    const renderFunction = compile.toFunction(template);

    expect(renderFunction({ users: [] })).toBe('<ul><li>No content</li></ul>');
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
    const template = '<component userList users={{&users}}></component>';
    const userList = '<ul><list users as="user"><li>{{:user.name}}</li></list></ul>';
    const renderFunction = compile.toFunction(template, { userList });

    const context = { users: [{ name: 'John' }, { name: 'Jane' }] };
    expect(renderFunction(context)).toBe('<ul><li>John</li><li>Jane</li></ul>');
  }
);

it('should render a nested component from inside a list',
  () =>
  {
    const userList = '<li>{{user.name}}</li>';
    const template = '<ul><list users as="user"><component userList user={{&:user}}></component></list></ul>';
    const renderFunction = compile.toFunction(template, { userList });

    const context = { users: [{ name: 'John' }, { name: 'Jane' }] };
    expect(renderFunction(context)).toBe('<ul><li>John</li><li>Jane</li></ul>');
  }
);

it('should render nested lists',
  () =>
  {
    const template =
      '<ul><list users as="user"><li>{{:user.name}}<ul><list :user.pets as="pet">' +
      '<li>{{:pet.name}}</li></list></ul></li></list></ul>';
    const renderFunction = compile.toFunction(template);

    const context = {
      users: [
        { name: 'John', pets: [{ name: 'Scar' }, { name: 'Mufasa' }] },
        { name: 'Jane', pets: [{ name: 'Purr' }] }
      ]
    };

    expect(renderFunction(context)).toBe(
      '<ul><li>John<ul><li>Scar</li><li>Mufasa</li></ul></li>' +
      '<li>Jane<ul><li>Purr</li></ul></li></ul>'
    );
  }
);