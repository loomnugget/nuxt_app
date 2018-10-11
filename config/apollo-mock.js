import { addMockFunctionsToSchema } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { schema, mocks } from './mock-schema';

export default (context) => {
  addMockFunctionsToSchema({ schema, mocks: mocks(context) });
  const link = new SchemaLink({ schema });

  return {
    link,
    cache: new InMemoryCache()
  }
}
