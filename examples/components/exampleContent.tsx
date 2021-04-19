import React from 'react';
import { ErrorBoundary } from './errorBoundary';
import { Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import { GraphqlCode } from './graphqlCode';
import JSONTree from 'react-json-tree';
const useStyles = makeStyles((theme) => ({
  jsonTreeWrapper: {
    background: '#002b35',
    padding: theme.spacing(2),
    borderRadius: 6,
    marginTop: theme.spacing(1),
    border: '1px solid black',
  },
}));
export const ExampleContent: React.FunctionComponent<{
  document: string;
  children: (childProps: {
    onSubmit: (value: any) => unknown;
  }) => JSX.Element | JSX.Element[];
}> = ({ document, children }) => {
  const classes = useStyles();
  const [result, setResult] = React.useState(null);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Typography variant="h5">Graphql Mutation Source</Typography>
        <GraphqlCode>{document}</GraphqlCode>
        <Divider />
        <Typography variant="h5">Generated Form</Typography>
        <ErrorBoundary>
          {children({
            onSubmit: (r) => {
              setResult(() => r);
            },
          })}
        </ErrorBoundary>
      </Grid>
      <Grid item xs={12} md={5}>
        <Typography variant="h5">Form Result</Typography>
        {result ? (
          <div className={classes.jsonTreeWrapper}>
            <JSONTree invertTheme={false} data={result} />
          </div>
        ) : (
          <Typography>Submit the form to see the result</Typography>
        )}
      </Grid>
    </Grid>
  );
};
