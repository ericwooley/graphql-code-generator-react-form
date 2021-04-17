import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Checkbox, ListItemIcon, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      color: theme.palette.secondary.main,
      margin: '0 auto',
    },
  })
);

function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
  return <ListItem button component="a" {...props} />;
}

export default function Todo() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5">Work in Progress</Typography>
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
      </List>
    </div>
  );
}
