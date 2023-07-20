import * as React from 'react';
import Head from 'next/head';
import { View } from '@instructure/ui-view';
import { Billboard } from '@instructure/ui-billboard';

export default function Index() {
  const messageText = (
    <p>
      This tool requires third-party cookies to be enabled. Please double-check
      your browser settings and reload the page.
    </p>
  );
  return (
    <View>
      <Head>
        <title>Please Enable Third-Party Cookies</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <View as="header" margin="xx-large 0 0">
        <Billboard
          size="medium"
          heading="Cookies disabled"
          message={messageText}
        />
      </View>
    </View>
  );
}
