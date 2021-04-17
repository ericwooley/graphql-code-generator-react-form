import React from 'react';
import { ErrorBoundary } from './errorBoundary';
import { AddUsersForm } from '../generated/formik';
import addUsersDocument from '../documents/addUsers.graphql';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
export const RecursiveUserExample = () => {
  return (
    <Card>
      <CardHeader title="Add Users Recursive"></CardHeader>
      <CardContent>
        <SyntaxHighlighter
          language="graphql"
          style={dark}
          customStyle={{ backgroundColor: '#002b35', border: 0 }}
        >
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
