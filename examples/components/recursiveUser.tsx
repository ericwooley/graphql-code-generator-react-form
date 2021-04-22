import React from 'react';
import { AddUsersForm } from '../generated/forms';
import addUsersDocument from '../documents/addUsers.graphql';
import { ExampleContent } from './exampleContent';
export const RecursiveUserExample = () => {
  return (
    <ExampleContent document={addUsersDocument}>
      {({ onSubmit, useInitialValues }) => {
        const demoContent = (
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

        return demoContent;
      }}
    </ExampleContent>
  );
};
