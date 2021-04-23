import React from 'react';
import { AddUserFromObjectForm, GQLReactFormContext } from '../generated/forms';
import addUserFromObjectDocument from '../documents/addUserFromObject.graphql';
import { ExampleContent } from './exampleContent';
import { baseMaterialUIComponents } from './baseMaterialUIComponents';
export const AddUserFromObject = () => {
  return (
    <ExampleContent document={addUserFromObjectDocument}>
      {({ onSubmit, useCustomComponents, useInitialValues }) => {
        const content = (
          <AddUserFromObjectForm
            key={`add-user-from-object-${useInitialValues}`}
            initialValues={
              useInitialValues
                ? {
                    user: {
                      email: 'object@user.com',
                      friends: [],
                      name: 'object user',
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
