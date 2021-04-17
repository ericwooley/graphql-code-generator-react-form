import Head from 'next/head';
import { AddUsersForm, mutationsMetaData } from '../generated/formik';
import JSONTree from 'react-json-tree';
import { RecursiveUserExample } from '../components/recursiveUser';
import { Container, CssBaseline, Grid } from '@material-ui/core';
import { MutationsMetaData } from '../components/mutationsMetaData';

export default function Home() {
  return (
    <Container maxWidth="xl">
      <CssBaseline />
      <Head>
        <title>Graphql React Form Generator Examples</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Graphql React Form Generator</h1>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <RecursiveUserExample />
          </Grid>
          <Grid item xs={12}>
            <MutationsMetaData />
          </Grid>
        </Grid>
      </main>
    </Container>
  );
}
