import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Checkbox, Link, ListItemIcon, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      margin: '0 auto',
      padding: theme.spacing(2),
    },
  })
);

export default function Todo() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5">Road Map To Release</Typography>
      <Typography color="textPrimary">
        follow{' '}
        <Link
          href="http://twitter.com/ericwooley"
          target="_blank"
          rel="noopener"
        >
          @ericwooley
        </Link>{' '}
        for updates
      </Typography>
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem>
          <ListItemIcon>
            <Checkbox edge="start" checked={false} tabIndex={-1} disabled />
          </ListItemIcon>
          <ListItemText primary="Make submit work with real values" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Checkbox edge="start" checked={false} tabIndex={-1} disabled />
          </ListItemIcon>
          <ListItemText primary="Customization through context" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Checkbox edge="start" checked={false} tabIndex={-1} disabled />
          </ListItemIcon>
          <ListItemText primary="Optional React Native Support" />
        </ListItem>
      </List>
    </div>
  );
}
