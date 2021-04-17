import React from 'react';
import { ErrorBoundary } from './errorBoundary';
import { AddUserForm } from '../generated/formik';
import addUserDocument from '../documents/addUser.graphql';
import { Grid } from '@material-ui/core';
import { GraphqlCode } from './graphqlCode';
export const AddUser = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <GraphqlCode>{addUserDocument}</GraphqlCode>
      </Grid>
      <Grid item xs={12} md={5}>
        <ErrorBoundary>
          <AddUserForm
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
