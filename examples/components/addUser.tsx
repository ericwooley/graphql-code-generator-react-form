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
  const [useCustomComponents, setUseCustomComponents] = React.useState(true);
  const demoContent = (
    <ExampleContent
      options={
        <FormControlLabel
          label="Use Custom Components"
          control={
            <Switch
              checked={useCustomComponents}
              onChange={(e) => setUseCustomComponents(e.target.checked)}
            />
          }
        ></FormControlLabel>
      }
      document={addUserDocument}
    >
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
        input: (props) => (
          <Box m={2}>
            <TextField
              fullWidth
              variant="outlined"
              label={props.label}
              value={props.value}
              onChange={(e) => props.onChange(e.target.value)}
            />
          </Box>
        ),
      }}
    >
      {demoContent}
    </GQLReactFormContext.Provider>
  ) : (
    demoContent
  );
};
