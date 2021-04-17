import React from 'react';
import { AddUserFromObjectForm } from '../generated/formik';
import addUserFromObjectDocument from '../documents/addUserFromObject.graphql';
import { ExampleContent } from './exampleContent';
export const AddUserFromObject = () => {
  return (
    <ExampleContent document={addUserFromObjectDocument}>
      {({ onSubmit }) => (
        <AddUserFromObjectForm initialValues={{}} onSubmit={onSubmit} />
      )}
    </ExampleContent>
  );
};
