import { HttpMethod, useServer } from 'forma-serve';

useServer(
  {
    routes: [
      {
        path: '/',
        method: HttpMethod.GET,
        handler: (context) => context.json({ message: 'Hello world' })
      }
    ]
  }
);