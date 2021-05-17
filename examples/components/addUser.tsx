import React from 'react';
import { AddUserForm, GQLReactFormContext } from '../generated/forms';
import addUserDocument from '../documents/addUser.graphql';
import { ExampleContent } from './exampleContent';
import { Box, FormControlLabel, Switch, TextField } from '@material-ui/core';
import { baseMaterialUIComponents } from './baseMaterialUIComponents';
export const AddUser = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <ExampleContent document={addUserDocument}>
      {({ onSubmit, useInitialValues, useCustomComponents }) => {
        const formContent = (
          <AddUserForm
            validate={{
              email: ({ touched, value }) => {
                if (!touched) return '';
                if (!value.match(/.+@.+\..+/))
                  return 'Email must be a valid email';
                return '';
              },
              name: () => '',
              password: () => '',
            }}
            key={`user-form-${useInitialValues}`}
            initialValues={
              useInitialValues
                ? {
                    email: 'bob@gmail.com',
                    name: 'test name',
                    password: 'test123',
                  }
                : undefined
            }
            onSubmit={onSubmit}
          />
        );
        return useCustomComponents ? (
          <GQLReactFormContext.Provider
            value={{
              ...baseMaterialUIComponents,
              input: (props) => {
                return (
                  <Box m={2}>
                    <TextField
                      type={
                        props.name === 'password' && !showPassword
                          ? 'password'
                          : 'text'
                      }
                      fullWidth
                      variant="outlined"
                      label={props.label}
                      value={props.value}
                      onChange={(e) => props.onChange(e.target.value)}
                    />
                    {props.name === 'password' && (
                      <FormControlLabel
                        label="show password"
                        control={
                          <Switch
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                          />
                        }
                      ></FormControlLabel>
                    )}
                  </Box>
                );
              },
            }}
          >
            {formContent}
          </GQLReactFormContext.Provider>
        ) : (
          formContent
        );
      }}
    </ExampleContent>
  );
};
