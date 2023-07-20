import React from 'react';
import theme from '@instructure/canvas-theme';
import { ApolloProvider } from '@apollo/react-hooks';
import { useApollo } from '../lib/apolloClient';
import { EmotionThemeProvider } from '@instructure/emotion';

export default function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <EmotionThemeProvider theme={theme}>
        <Component {...pageProps} />
      </EmotionThemeProvider>
    </ApolloProvider>
  );
}
