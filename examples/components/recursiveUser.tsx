import React from 'react';
import { ErrorBoundary } from './errorBoundary';
import { AddUsersForm, mutationsMetaData } from '../generated/formik';
import addUsersDocument from '../documents/addUsers.graphql';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import prism from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import JSONTree from 'react-json-tree';
export const RecursiveUserExample = () => {
  return (
    <Card>
      <CardHeader title="Add Users Recursive"></CardHeader>
      <CardContent>
        <SyntaxHighlighter language="graphql" style={prism}>
          {addUsersDocument}
        </SyntaxHighlighter>
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
