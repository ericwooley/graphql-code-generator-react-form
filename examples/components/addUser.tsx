import React from 'react';
import { AddUserForm, GQLReactFormContext } from '../generated/forms';
import addUserDocument from '../documents/addUser.graphql';
import { ExampleContent } from './exampleContent';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from '@material-ui/core';
export const AddUser = () => {
  const [useInitialValues, setUserInitialValues] = React.useState(false);
  const [useCustomComponents, setUseCustomComponents] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const demoContent = (
    <ExampleContent
      options={
        <>
          <FormControlLabel
            label="Use Custom Components"
            control={
              <Switch
                checked={useCustomComponents}
                onChange={(e) => setUseCustomComponents(e.target.checked)}
              />
            }
          ></FormControlLabel>
          <FormControlLabel
            label="Use Initial Values"
            control={
              <Switch
                checked={useInitialValues}
                onChange={(e) => setUserInitialValues(e.target.checked)}
              />
            }
          ></FormControlLabel>
        </>
      }
      document={addUserDocument}
    >
      {({ onSubmit }) => (
        <AddUserForm
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
      )}
    </ExampleContent>
  );
  return useCustomComponents ? (
    <GQLReactFormContext.Provider
      value={{
        submitButton: (props) => (
          <Box m={2}>
            <Button fullWidth variant="contained" color="primary" type="submit">
              {props.text}
            </Button>
          </Box>
        ),
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
      {demoContent}
    </GQLReactFormContext.Provider>
  ) : (
    demoContent
  );
};
