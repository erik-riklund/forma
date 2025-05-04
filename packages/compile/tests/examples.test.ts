import { compile } from '-';
import { it, expect } from 'bun:test';

it('should render the basic example correctly',
  () =>
  {
    const template =
      `<component layout><render slot="header"><h1>Welcome to Forma, {{ user.name }}!</h1></render>` +
      `<ul><list news as="article"><li><h2>{{: article.title }}</h2><p>{{: article.date }} by ` +
      `{{: article.author }}</p><p>{{: article.body }}</p></li></list></ul></component>`;

    const layout = `<slot header />{{@ children}}`;

    const context =
    {
      user: { name: 'John' },
      news: [
        {
          title: 'Forma is a declarative, component-based template compiler',
          date: '2023-10-01',
          author: 'Forma Team',
          body: 'Forma is a declarative, component-based template compiler with a focus on server-side rendering.'
        },
        {
          title: 'The Forma team is working hard to make it even better',
          date: '2023-10-02',
          author: 'Forma Team',
          body: 'The Forma team is working hard to make it even better. ' +
            'We are constantly improving the compiler and adding new features.'
        }
      ]
    };

    const renderFunction = compile.toFunction(template, { layout });
    const result = renderFunction(context);

    expect(result).toContain('<h1>Welcome to Forma, John!</h1>');
    expect(result).toContain('<p>Forma is a declarative, component-based template compiler with a focus on server-side rendering.</p>');
    expect(result).toContain('<p>2023-10-01 by Forma Team</p>');
  }
);

it('should render the extended basic example correctly',
  () =>
  {
    const template = `<component layout><render slot="header"><h1>Welcome to Forma, {{user.name->"Guest"}}!</h1>` +
      `<p>Forma is a declarative, component-based template compiler with a focus on server-side rendering.</p></render>` +
      `<ul><list news as="title,date,icon,author,body"><li><h2>{{:title}}</h2><if condition={{:icon}}><div>` +
      `<img src="/images/icons/{{:icon}}"></div></if><p>{{:date}} by {{:author}}</p><p>{{:body}}</p></li>` +
      `<empty><li>No news have been posted yet.</li></empty></list></ul></component>`;

    const layout = `<slot header />{{@ children}}`;
    const renderFunction = compile.toFunction(template, { layout });

    const context =
    {
      news: [
        {
          title: 'Forma is a declarative, component-based template compiler',
          date: '2023-10-01',
          author: 'Forma Team',
          icon: 'forma.png',
          body: 'Forma is a declarative, component-based template compiler with a focus on server-side rendering.'
        },
        {
          title: 'The Forma team is working hard to make it even better',
          date: '2023-10-02',
          author: 'Forma Team',
          body: 'The Forma team is working hard to make it even better. ' +
            'We are constantly improving the compiler and adding new features.'
        }
      ]
    };

    const result = renderFunction(context);

    expect(result).toContain('<h1>Welcome to Forma, Guest!</h1>');
    expect(result).toContain('<img src="/images/icons/forma.png">');
    expect(result).toContain('We are constantly improving the compiler and adding new features.');
  }
);

it('should render the extended basic example correctly with an empty list',
  () =>
  {
    const template = `<component layout><render slot="header"><h1>Welcome to Forma, {{user.name->"Guest"}}!</h1>` +
      `<p>Forma is a declarative, component-based template compiler with a focus on server-side rendering.</p></render>` +
      `<ul><list news as="title,date,icon,author,body"><li><h2>{{:title}}</h2><if condition={{:icon}}><div>` +
      `<img src="/images/icons/{{:icon}}"></div></if><p>{{:date}} by {{:author}}</p><p>{{:body}}</p></li>` +
      `<empty><li>No news have been posted yet.</li></empty></list></ul></component>`;

    const layout = `<slot header />{{@ children}}`;
    const renderFunction = compile.toFunction(template, { layout });
    const context = { user: { name: 'John' }, news: [] };

    const result = renderFunction(context);

    expect(result).toContain('<h1>Welcome to Forma, John!</h1>');
    expect(result).not.toContain('<img src="/images/icons');
    expect(result).toContain('No news have been posted yet.');
  }
);