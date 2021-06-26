import React from 'react';
import {
  AddUserFromObjectForm,
  AddUserFromObjectFormVariables,
  GQLReactFormContext,
  UserRole,
} from '../generated/forms';
import addUserFromObjectDocument from '../documents/addUserFromObject.graphql';
import { ExampleContent } from './exampleContent';
import { baseMaterialUIComponents } from './baseMaterialUIComponents';
import { validateEmail, validateUser } from '../validations';
export const AddUserFromObject = () => {
  return (
    <ExampleContent document={addUserFromObjectDocument}>
      {({ onSubmit, useCustomComponents, useInitialValues }) => {
        const validateUserForm = (
          result: Partial<AddUserFromObjectFormVariables>
        ) => {
          return {
            user: result.user ? validateUser(result.user) : 'User is required',
          };
        };
        const content = (
          <AddUserFromObjectForm
            key={`add-user-from-object-${useInitialValues}`}
            validate={validateUserForm}
            initialValues={
              useInitialValues
                ? {
                    user: {
                      email: 'object@user.com',
                      friends: [],
                      name: 'object user',
                      role: UserRole.Admin,
                    },
                  }
                : undefined
            }
            onSubmit={onSubmit}
          />
        );

        return useCustomComponents ? (
          <GQLReactFormContext.Provider value={{ ...baseMaterialUIComponents }}>
            {content}
          </GQLReactFormContext.Provider>
        ) : (
          content
        );
      }}
    </ExampleContent>
  );
};
