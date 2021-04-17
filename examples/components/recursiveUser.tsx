import React from 'react';
import { ErrorBoundary } from './errorBoundary';
import { AddUsersForm } from '../generated/formik';
import addUsersDocument from '../documents/addUsers.graphql';
import { Grid } from '@material-ui/core';
import { GraphqlCode } from './graphqlCode';
export const RecursiveUserExample = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <GraphqlCode>{addUsersDocument}</GraphqlCode>
      </Grid>
      <Grid item xs={12} md={5}>
        <ErrorBoundary>
          <AddUsersForm
            initialValues={{
              users: [],
            }}
            onSubmit={(addUsersData) => {
              console.log('Add Users Form Submit', addUsersData);
            }}
          />
        </ErrorBoundary>
      </Grid>
    </Grid>
  );
};
