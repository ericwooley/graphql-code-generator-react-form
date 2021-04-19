import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { Link, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 560,
      textAlign: 'right',
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
            inProgress: true,
          },
          {
            title: 'Validation',
            inProgress: false,
          },
          {
            title: 'Optional React Native Support',
            inProgress: false,
          },
        ].map(({ title, inProgress }) => {
          return (
            <Typography key={title}>
              {title + ` (${inProgress ? 'in progress' : 'not started'})`}
            </Typography>
          );
        })}
      </List>
    </div>
  );
}
