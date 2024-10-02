'use client';
import apolloClient from './apolloClient';
import { ApolloProvider } from '@apollo/client';

export const ApolloWrapper = ({ children }: {children: React.ReactNode}) => {
    return (
        <ApolloProvider client={apolloClient}>
        {children}
        </ApolloProvider>
    );
};