import React from 'react';
import { ErrorBoundary } from './errorBoundary';
import { Divider, Grid, Typography } from '@material-ui/core';
import { GraphqlCode } from './graphqlCode';
import { JsonCode } from './jsonCode';
export const ExampleContent: React.FunctionComponent<{
  document: string;
  children: (childProps: {
    onSubmit: (value: any) => unknown;
  }) => JSX.Element | JSX.Element[];
}> = ({ document, children }) => {
  const [result, setResult] = React.useState(null);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Typography variant="h5">Graphql Mutation Source</Typography>
        <GraphqlCode>{document}</GraphqlCode>
        <Divider />
        <Typography variant="h5">Generated Form</Typography>
        <ErrorBoundary>{children({ onSubmit: setResult })}</ErrorBoundary>
      </Grid>
      <Grid item xs={12} md={5}>
        <Typography variant="h5">Form Result</Typography>
        {result ? (
          <JsonCode>{JSON.stringify(result, null, 2)}</JsonCode>
        ) : (
          <Typography>Submit the form to see the result</Typography>
        )}
      </Grid>
    </Grid>
  );
};
