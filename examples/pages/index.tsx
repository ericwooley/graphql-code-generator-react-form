import { RecursiveUserExample } from '../components/recursiveUser';
import { Container, CssBaseline, Grid } from '@material-ui/core';
import { MutationsMetaData } from '../components/mutationsMetaData';

export default function Home() {
  return (
    <Container maxWidth="xl">
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
