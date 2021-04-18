import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import DataTabs from '../components/DataTabs';
import Examples from '../components/examples';
import Image from 'next/image';
import Todo from '../components/todo';
import MenuIcon from '@material-ui/icons/Menu';
import GithubIcon from '@material-ui/icons/GitHub';
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
