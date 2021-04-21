import React from 'react';
import { AddUserForm, GQLReactFormContext } from '../generated/forms';
import addUserDocument from '../documents/addUser.graphql';
import { ExampleContent } from './exampleContent';
import { TextField } from '@material-ui/core';
export const AddUser = () => {
  return (
    <GQLReactFormContext.Provider
      value={{
        String: (props) => (
          <TextField
            onChange={(e) => props.onChange(e.target.value)}
            value={props.value || ''}
          />
        ),
      }}
    >
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
    </GQLReactFormContext.Provider>
  );
};
