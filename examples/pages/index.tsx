import {
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import DataTabs from '../components/DataTabs';
import Examples from '../components/examples';
import Image from 'next/image';
import Todo from '../components/todo';
import { Layout } from '../components/layout';

const useStyles = makeStyles((theme) => ({
  header: {
    textAlign: 'center',
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(8),
    background: 'rgba(240, 240, 240)',
  },
  content: {},
  title: {
    // color: '#32485c',
    color: theme.palette.secondary.light,
    fontWeight: 700,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  nav: {
    background: 'white',
  },
  links: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    flex: 0,
  },
}));
export default function Home() {
  const classes = useStyles();
  return (
    <Layout title="Examples">
      <div className={classes.header}>
        <Container maxWidth="md">
          <Grid container>
            <Grid item xs={12} md={6}>
              <div style={{ maxWidth: 440, margin: '0 auto' }}>
                <a href="https://www.graphql-code-generator.com/">
                  <Image
                    src="/gql-codegen-cover.png"
                    layout="responsive"
                    alt="Graphql Code Generator logo"
                    width={934}
                    height={864}
                  />
                </a>
              </div>
              <Typography variant="h3" component="h1" className={classes.title}>
                React Form Plugin
              </Typography>
            </Grid>
            <Grid xs={12} md={6}>
              <Todo />
            </Grid>
          </Grid>
        </Container>
      </div>
      <Paper elevation={0} className={classes.content}>
        <Grid container>
          <Grid item xs={12} md={8}>
            <Examples />
          </Grid>
          <Grid item xs={12} md={4}>
            <DataTabs />
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
}
