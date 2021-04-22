import React from 'react';
import { ErrorBoundary } from './errorBoundary';
import {
  Divider,
  FormControlLabel,
  Grid,
  makeStyles,
  Switch,
  Typography,
} from '@material-ui/core';
import { GraphqlCode } from './graphqlCode';
import JSONTree from 'react-json-tree';
const useStyles = makeStyles((theme) => ({
  jsonTreeWrapper: {
    background: '#002b35',
    padding: theme.spacing(2),
    borderRadius: 6,
    marginTop: theme.spacing(1),
    border: '1px solid black',
  },
}));
export const ExampleContent: React.FunctionComponent<{
  document: string;
  options?: JSX.Element | JSX.Element[];
  children: (childProps: {
    useInitialValues: boolean;
    useCustomComponents: boolean;
    onSubmit: (value: any) => unknown;
  }) => JSX.Element | JSX.Element[];
}> = ({ document, children, options }) => {
  const classes = useStyles();
  const [result, setResult] = React.useState(null);
  const [useInitialValues, setUserInitialValues] = React.useState(false);
  const [useCustomComponents, setUseCustomComponents] = React.useState(true);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Typography variant="h5">Graphql Mutation Source</Typography>
        <GraphqlCode>{document}</GraphqlCode>
        <Divider />
        <>
          <Typography variant="h5">Options</Typography>
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
          {options}
          <Divider />
        </>
        <Typography variant="h5">Generated Form</Typography>
        <ErrorBoundary>
          {children({
            useInitialValues,
            useCustomComponents,
            onSubmit: (r) => {
              setResult(() => r);
            },
          })}
        </ErrorBoundary>
      </Grid>
      <Grid item xs={12} md={5}>
        <Typography variant="h5">Form Result</Typography>
        {result ? (
          <div className={classes.jsonTreeWrapper}>
            <JSONTree invertTheme={false} data={result} />
          </div>
        ) : (
          <Typography>Submit the form to see the result</Typography>
        )}
      </Grid>
    </Grid>
  );
};
