import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import DataTabs from '../components/DataTabs';
import Examples from '../components/examples';
import Image from 'next/image';
import Todo from '../components/todo';

const useStyles = makeStyles((theme) => ({
  header: {
    textAlign: 'center',
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(8),
  },
  content: {
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  title: {
    // color: '#32485c',
    color: theme.palette.secondary.light,
    fontWeight: 700,
  },
}));
export default function Home() {
  const classes = useStyles();
  return (
    <main>
      <div className={classes.header}>
        <div style={{ maxWidth: 734, margin: '0 auto' }}>
          <Image
            src="/gql-codegen-cover.png"
            layout="responsive"
            alt="Graphql Code Generator logo"
            width={934}
            height={864}
          />
        </div>
        <Typography variant="h3" component="h1" className={classes.title}>
          React Form Plugin
        </Typography>

        <Todo />
      </div>
      <div className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Examples />
          </Grid>
          <Grid item xs={12} md={4}>
            <DataTabs />
          </Grid>
        </Grid>
      </div>
    </main>
  );
}
