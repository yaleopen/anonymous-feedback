import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config';
import { setContext } from '@apollo/client/link/context';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient
const { publicRuntimeConfig } = getConfig();

const httpLink = createHttpLink({
  uri: `${publicRuntimeConfig.backendURL}/graphql`,
});

async function fetchToken() {
  const response = await fetch(`${publicRuntimeConfig.basePath}/api/user`);
  const user = await response.json();
  const token = user ? user.backendToken : null;
  return token;
}

const authLink = setContext(async (_, ctx) => {
  // get the authentication token from session if it exists
  const token = await fetchToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...ctx.headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

function createApolloClient() {
  return new ApolloClient({
    credentials: 'include',
    name: typeof window === 'undefined' ? "Server" : "Client",
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    fetch
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}
