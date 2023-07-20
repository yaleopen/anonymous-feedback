import React, { Component } from 'react';
import Head from 'next/head';
import { View } from '@instructure/ui-view';
import { Billboard } from '@instructure/ui-billboard';
import { Alert } from '@instructure/ui-alerts';
import PropTypes from 'prop-types';

class MainLayout extends Component {
  render() {
    const { children, title, messageText } = this.props;
    let cookiesEnabled;
    if (typeof window === 'object') {
      cookiesEnabled = document.cookiesEnabled;
    }

    let cookieAlert;
    if (cookiesEnabled) {
      cookieAlert = (
        <Alert
          variant="error"
          margin="small"
          liveRegion={() => document.getElementById('flash-messages')}
          liveRegionPoliteness="assertive"
        >
          Please enable cookies
        </Alert>
      );
    }

    return (
      <View as="div">
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <View as="header" margin="0 0 medium">
          <Billboard
            size="medium"
            heading="Anonymous Course Feedback &amp; Accessibility Barriers"
            message={messageText}
          />
        </View>
        <View as="div" margin="0 0 small" padding="0" id="flash-messages">
          {cookieAlert}
          {children}
        </View>
      </View>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default MainLayout;
