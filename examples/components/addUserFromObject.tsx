import React from 'react';
import { ErrorBoundary } from './errorBoundary';
import { AddUserFromObjectForm } from '../generated/formik';
import addUserFromObjectDocument from '../documents/addUserFromObject.graphql';
import { Grid } from '@material-ui/core';
import { GraphqlCode } from './graphqlCode';
export const AddUserFromObject = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <GraphqlCode>{addUserFromObjectDocument}</GraphqlCode>
      </Grid>
      <Grid item xs={12} md={5}>
        <ErrorBoundary>
          <AddUserFromObjectForm
            initialValues={{}}
            onSubmit={(addUsersData) => {
              console.log('Add Users Form Submit', addUsersData);
            }}
          />
        </ErrorBoundary>
      </Grid>
    </Grid>
  );
};
