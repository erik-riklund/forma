import { compile } from '-';
import { it, expect } from 'bun:test';

it('should render a template with multiple dependencies',
  () =>
  {
    const blog =
      '<h1>Welcome to {{ name }}!</h1><ul><list posts as="post"><component post ' +
      'title="{: post.title}" content="{: post.content}" author="{: post.author}" /></list></ul>';
    const post =
      '<article><h2>{{ title }}</h2><component author author="{ author }" /><p>{{ content }}</p></article>';
    const author =
      '<p><strong>{{ author.name }}</strong> (<em>{{ author.alias }}</em>)</p>';

    const expected =
      '<h1>Welcome to Forma!</h1><ul><article><h2>Forma is under construction</h2>' +
      '<p><strong>Erik Riklund</strong> (<em>Gopher</em>)</p><p>Lorem ipsum dolor sit amet, ' +
      'consectetur adipiscing elit.</p></article></ul>';

    const data = {
      name: 'Forma',
      posts: [
        {
          title: 'Forma is under construction',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          author: { name: 'Erik Riklund', alias: 'Gopher' }
        }
      ]
    };

    const renderFunction = compile.toFunction(blog, { post, author });
    expect(renderFunction(data)).toBe(expected);
  }
);