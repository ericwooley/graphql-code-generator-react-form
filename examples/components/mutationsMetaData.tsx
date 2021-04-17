import { Card, CardContent, CardHeader } from '@material-ui/core';
import React from 'react';
import JSONTree from 'react-json-tree';
import { mutationsMetaData } from '../generated/formik';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  content: {
    background: '#002b35',
    padding: theme.spacing(2),
  },
}));
export const MutationsMetaData = () => {
  const classes = useStyles();
  return (
    <Card style={{ borderRadius: '0 0 4px 4px' }}>
      <CardHeader title="Mutation Data Explorer" />
      <CardContent className={classes.content}>
        {typeof window !== 'undefined' && (
          <JSONTree invertTheme={false} data={mutationsMetaData} />
        )}
      </CardContent>
    </Card>
  );
};
