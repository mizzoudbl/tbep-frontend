'use client';
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { envURL } from './utils';

const httpLink = new HttpLink({
  credentials: 'include',
  uri: `${envURL(process.env.NEXT_PUBLIC_BACKEND_URL)}/graphql`,
});

const client = new ApolloClient({
  link: ApolloLink.from([removeTypenameFromVariables(), httpLink]),
  cache: new InMemoryCache(),
  assumeImmutableResults: true,
});

export const ApolloWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
