import {
  Avatar,
  Box,
  Button,
  ButtonProps,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  useTheme,
} from '@material-ui/core';
import {
  GQLReactFormContext,
  GQLReactFormButtonProps,
} from '../generated/forms';

const BaseButton = ({
  onClick,
  children,
  style,
  ...props
}: GQLReactFormButtonProps & ButtonProps) => {
  return (
    <Box m={2} style={style}>
      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    </Box>
  );
};
export const baseMaterialUIComponents: Partial<GQLReactFormContext> = {
  addButton: (props) => (
    <BaseButton {...props} onClick={props.onClick}>
      Add {props.name}
    </BaseButton>
  ),
  listWrapper: (props) => (
    <Paper elevation={1} style={{ padding: 4, margin: 4 }}>
      {props.children}
    </Paper>
  ),
  div: (props) => <div>{props.children}</div>,
  listItem: (props) => {
    const theme = useTheme();
    return (
      <div style={{ display: 'flex', flexDirection: 'row', marginTop: 4 }}>
        <div
          style={{
            flex: 0,
            marginLeft: 4,
            marginRight: 8,
            marginTop: 16,
            height: '100%',
          }}
        >
          <Avatar style={{ background: theme.palette.primary.dark }}>
            {String(props.idx + 1)}
          </Avatar>
          <div
            style={{
              height: '100%',
              borderLeft: '1px solid grey',
              margin: '0 auto',
            }}
          ></div>
        </div>
        <div style={{ flex: 1 }}>{props.children}</div>
      </div>
    );
  },
  removeButton: (props) => (
    <Button
      {...props}
      variant="outlined"
      color="secondary"
      fullWidth={false}
      style={{ display: 'absolute', top: 0, right: 0 }}
    >
      Remove {props.scalar.replace('Input', '')}
    </Button>
  ),
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
