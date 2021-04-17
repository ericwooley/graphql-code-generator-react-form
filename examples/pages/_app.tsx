import '../styles/globals.css';
import React from 'react';
import { CssBaseline } from '@material-ui/core';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <CssBaseline />
      <Head>
        <title>Graphql React Form Generator Examples</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
