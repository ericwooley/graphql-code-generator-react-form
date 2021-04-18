import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Checkbox, Link, ListItemIcon, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 560,
      textAlign: 'center',
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
        {[
          {
            title: 'Customization through context',
            done: false,
            inProgress: true,
          },
          {
            title: 'Validation',
            done: false,
            inProgress: false,
          },
          {
            title: 'Optional React Native Support',
            done: false,
            inProgress: false,
          },
        ].map(({ title, done, inProgress }) => {
          return (
            <ListItem key={title}>
              <ListItemIcon>
                <Checkbox edge="start" checked={done} tabIndex={-1} disabled />
              </ListItemIcon>
              <ListItemText
                primary={
                  title + ` (${inProgress ? 'in progress' : 'not started'})`
                }
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
