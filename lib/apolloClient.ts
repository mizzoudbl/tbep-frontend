import { ApolloClient, InMemoryCache } from '@apollo/client';
import { envURL } from './utils';

const client = new ApolloClient({
  uri: `${envURL(process.env.NEXT_PUBLIC_BACKEND_URL)}/graphql`,
  credentials: 'include',
  cache: new InMemoryCache({
    addTypename: false,
  }),
  assumeImmutableResults: true,
});

export default client;
