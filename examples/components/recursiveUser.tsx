import React from 'react';
import { AddUsersForm, GQLReactFormContext } from '../generated/forms';
import addUsersDocument from '../documents/addUsers.graphql';
import { ExampleContent } from './exampleContent';
import { baseMaterialUIComponents } from './baseMaterialUIComponents';
export const RecursiveUserExample = () => {
  return (
    <ExampleContent document={addUsersDocument}>
      {({ onSubmit, useInitialValues, useCustomComponents }) => {
        const content = (
          <AddUsersForm
            key={`AddUsersForm-${useInitialValues}`}
            initialValues={
              useInitialValues
                ? {
                    users: [
                      {
                        email: 'test-email@gmail.com',
                        name: 'test user',
                        mother: {
                          email: 'test-mother@gmail.com',
                          name: 'Test user mother',
                          friends: [],
                        },
                        friends: [],
                      },
                      {
                        email: 'test-email2@gmail.com',
                        name: 'test user 2',
                        friends: [
                          {
                            email: 'nested-test-email2@gmail.com',
                            name: 'nested test user 2',
                            friends: [],
                          },
                        ],
                      },
                    ],
                  }
                : undefined
            }
            onSubmit={onSubmit}
          />
        );

        return useCustomComponents ? (
          <GQLReactFormContext.Provider value={baseMaterialUIComponents}>
            {content}
          </GQLReactFormContext.Provider>
        ) : (
          content
        );
      }}
    </ExampleContent>
  );
};
