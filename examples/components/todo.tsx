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
            title: 'Enums',
            done: 50,
          },
          {
            title: 'Split into modules for context & forms.',
            done: 0,
          },
        ].map(({ title, done }) => {
          return (
            <Typography key={title}>{`${title}: ${String(done).padStart(
              2,
              '0'
            )}%`}</Typography>
          );
        })}
      </List>
    </div>
  );
}
