import {
  AppBar,
  Button,
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
  navLink: {
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(2),
  },
  menuButton: {},
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
const TitleLink: React.FunctionComponent<{
  title: string;
  href: string;
  active: boolean;
}> = ({ title, href, active }) => {
  const classes = useStyles();
  return (
    <div className={classes.navLink}>
      {active ? (
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
      ) : (
        <Button color="inherit" href={href}>
          {title}
        </Button>
      )}
    </div>
  );
};
export const Layout: React.FunctionComponent<{ title: string }> = ({
  title,
  children,
}) => {
  const classes = useStyles();
  return (
    <>
      <nav className={classes.nav}>
        <AppBar position="static" color="transparent">
          <Toolbar>
            <div className={classes.links}>
              <TitleLink
                title="Examples"
                active={title === 'Examples'}
                href="/"
              />
              <TitleLink
                title="Getting Started"
                active={title === 'Getting Started'}
                href="/gettingStarted"
              />
            </div>
            <div className={classes.button}>
              <IconButton
                href="https://github.com/ericwooley/graphql-code-generator-react-form"
                target="_blank"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <GithubIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </nav>
      <main>{children}</main>
    </>
  );
};
