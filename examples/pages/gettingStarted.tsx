import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Layout } from '../components/layout';

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: theme.spacing(2),
  },
}));
export default function Home() {
  const classes = useStyles();
  return (
    <Layout title="Getting Started">
      <Container maxWidth="xl">
        <Grid></Grid>
        <Card className={classes.content}>
          <CardHeader title="Getting Started"></CardHeader>
          <CardContent>
            <Typography>TODO</Typography>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
}
