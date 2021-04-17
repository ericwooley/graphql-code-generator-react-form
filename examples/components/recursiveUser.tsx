import React from 'react';
import { ErrorBoundary } from './errorBoundary';
import { AddUsersForm } from '../generated/formik';
import addUsersDocument from '../documents/addUsers.graphql';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { GraphqlCode } from './graphqlCode';
export const RecursiveUserExample = () => {
  return (
    <Card>
      <CardHeader title="Add Users Recursive"></CardHeader>
      <CardContent>
        <GraphqlCode>{addUsersDocument}</GraphqlCode>
        <Divider />
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
      </CardContent>
    </Card>
  );
};
