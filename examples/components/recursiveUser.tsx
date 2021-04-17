import React from 'react';
import { AddUsersForm } from '../generated/formik';
import addUsersDocument from '../documents/addUsers.graphql';
import { ExampleContent } from './exampleContent';
export const RecursiveUserExample = () => {
  return (
    <ExampleContent document={addUsersDocument}>
      {({ onSubmit }) => (
        <AddUsersForm
          initialValues={{
            users: [],
          }}
          onSubmit={onSubmit}
        />
      )}
    </ExampleContent>
  );
};
