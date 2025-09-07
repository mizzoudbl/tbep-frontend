'use client';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { RemoveTypenameFromVariablesLink } from '@apollo/client/link/remove-typename';
import { ApolloProvider } from '@apollo/client/react';
import { envURL } from './utils';

const httpLink = new HttpLink({
  credentials: 'include',
  uri: `${envURL(process.env.NEXT_PUBLIC_BACKEND_URL)}/graphql`,
});

const client = new ApolloClient({
  link: ApolloLink.from([new RemoveTypenameFromVariablesLink(), httpLink]),
  cache: new InMemoryCache(),
  assumeImmutableResults: true,
});

export const ApolloWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
