'use client';
import { ApolloProvider } from '@apollo/client';
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

export const ApolloWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
