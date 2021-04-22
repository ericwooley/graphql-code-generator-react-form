import { Box, Button, Paper, TextField } from '@material-ui/core';
import {
  GQLReactFormContext,
  GQLReactFormStandardProps,
} from '../generated/forms';

const BaseButton = (
  props: GQLReactFormStandardProps & { onClick?: () => any }
) => {
  return (
    <Box m={2}>
      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        onClick={props.onClick}
      >
        {props.children}
      </Button>
    </Box>
  );
};
export const baseMaterialUIComponents: Partial<GQLReactFormContext> = {
  addButton: (props) => (
    <BaseButton {...props}>Add {props.scalar.replace('Input', '')}</BaseButton>
  ),
  removeButton: BaseButton,
  button: BaseButton,

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
          type={'text'}
          fullWidth
          variant="outlined"
          label={props.label}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </Box>
    );
  },
};
