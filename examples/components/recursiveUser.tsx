import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import {
  AddUsersFromListForm,
  GQLReactFormContext,
  UserInput,
} from '../generated/forms';
import addUsersDocument from '../documents/addUsers.graphql';
import { ExampleContent } from './exampleContent';
import { baseMaterialUIComponents } from './baseMaterialUIComponents';
import { Select, MenuItem, Divider } from '@material-ui/core';
const users: { [key: string]: UserInput } = {
  'Michael Scott': {
    email: 'mscott@dundermifflin.com',
    friends: [],
    name: 'Michael Scott',
  },
  'Dwight Schrute': {
    email: 'dschrute@dundermifflin.com',
    friends: [],
    name: 'Dwight Schrute',
  },
  'Pam Beasly': {
    email: 'pbeasly@dundermifflin.com',
    friends: [],
    name: 'Pam Beasly',
  },
  'Jim Halpert': {
    email: 'jhalpert@dundermifflin.com',
    friends: [],
    name: 'Jim Halpert',
  },
};
export const RecursiveUserExample = () => {
  return (
    <ExampleContent document={addUsersDocument}>
      {({ onSubmit, useInitialValues, useCustomComponents }) => {
        const content = (
          <AddUsersFromListForm
            customComponents={
              useCustomComponents
                ? {
                    UserInput: (props) => {
                      return (
                        <>
                          <InputLabel id={props.name}>
                            Select An Office Character
                          </InputLabel>
                          <Select
                            labelId={props.name}
                            id={props.name}
                            value={props.value?.name}
                            onChange={(event: any) => {
                              if (users[event.target.value])
                                props.onChange(users[event.target.value]);
                            }}
                          >
                            {Object.keys(users).map((u) => (
                              <MenuItem key={u} value={u}>
                                {u}
                              </MenuItem>
                            ))}
                          </Select>
                          <Divider />
                        </>
                      );
                    },
                  }
                : undefined
            }
            key={`AddUsersForm-${useInitialValues}`}
            initialValues={
              useInitialValues
                ? {
                    users: [users['Michael Scott']],
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
