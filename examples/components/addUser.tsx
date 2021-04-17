import React from 'react';
import { AddUserForm } from '../generated/formik';
import addUserDocument from '../documents/addUser.graphql';
import { ExampleContent } from './exampleContent';
export const AddUser = () => {
  return (
    <ExampleContent document={addUserDocument}>
      {({ onSubmit }) => (
        <AddUserForm
          initialValues={{
            email: 'bob@gmail.com',
            name: 'test name',
          }}
          onSubmit={onSubmit}
        />
      )}
    </ExampleContent>
  );
};
