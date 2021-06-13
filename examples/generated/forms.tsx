import * as React from 'react';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  addUsers?: Maybe<Array<Maybe<User>>>;
  addUser?: Maybe<User>;
};

export type MutationRootAddUsersArgs = {
  users: Array<Maybe<UserInput>>;
};

export type MutationRootAddUserArgs = {
  user: UserInput;
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  allUsers: Array<Maybe<User>>;
  userById?: Maybe<User>;
  answer: Array<Scalars['Int']>;
};

export type QueryRootUserByIdArgs = {
  id: Scalars['Int'];
};

export type SubscriptionRoot = {
  __typename?: 'SubscriptionRoot';
  newUser?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  name: Scalars['String'];
  password?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  friends: Array<Maybe<User>>;
};

export type UserInput = {
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  email: Scalars['String'];
  password?: Maybe<Scalars['String']>;
  mother?: Maybe<UserInput>;
  father?: Maybe<UserInput>;
  friends: Array<Maybe<UserInput>>;
  followers?: Maybe<Array<Maybe<UserInput>>>;
};

export type AddUserMutationVariables = Exact<{
  email: Scalars['String'];
  name: Scalars['String'];
  password?: Maybe<Scalars['String']>;
}>;

export type AddUserMutation = { __typename?: 'MutationRoot' } & {
  addUser?: Maybe<{ __typename?: 'User' } & Pick<User, 'id'>>;
};

export type AddUserFromObjectMutationVariables = Exact<{
  user: UserInput;
}>;

export type AddUserFromObjectMutation = { __typename?: 'MutationRoot' } & {
  addUser?: Maybe<{ __typename?: 'User' } & Pick<User, 'id'>>;
};

export type AddUsersFromListMutationVariables = Exact<{
  users: Array<Maybe<UserInput>> | Maybe<UserInput>;
}>;

export type AddUsersFromListMutation = { __typename?: 'MutationRoot' } & {
  addUsers?: Maybe<Array<Maybe<{ __typename?: 'User' } & Pick<User, 'id'>>>>;
};

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = { __typename?: 'QueryRoot' } & {
  allUsers: Array<Maybe<{ __typename?: 'User' } & Pick<User, 'id'>>>;
};

export interface IGenericFormValidationResult {
  [key: string]:
    | undefined
    | string
    | IGenericFormValidationResult
    | (IGenericFormValidationResult | string)[];
}
export const isValidFromFormResult = (
  obj: IGenericFormValidationResult
): boolean => {
  return Object.values(obj).reduce((isValid: boolean, val) => {
    if (!isValid) return false;
    if (val === undefined) return true;
    if (typeof val === 'string') return val.length === 0;
    if (Array.isArray(val))
      return (
        val.find((nestedVal) =>
          typeof nestedVal === 'string'
            ? nestedVal
            : !isValidFromFormResult(nestedVal)
        ) === undefined
      );
    return isValidFromFormResult(val);
  }, true);
};

/**************************
 * utilities
 *************************/

let idNonce = 0;
const uniqueId = (inStr: string) => inStr + idNonce++;

export interface GQLReactFormStandardProps {
  children?: React.ReactNode;
  /**
   * path of properties to get to this item, separated by a dot
   * @example
   * // path = 'UserInput.friends.id'
   * const childOfUser = Boolean(path.split('.').includes('UserInput'))
   **/
  path: string;
  id?: string;
  /**
   * Number of Scalar Objects deep this property is
   **/
  depth: number;
  className?: string;
  name: string;
  scalar: string;
}
export interface GQLReactFormButtonProps extends GQLReactFormStandardProps {
  onClick?: (e?: { preventDefault: () => any }) => any;
}
interface FormPrimeInput
  extends React.FC<
    {
      onChange: (value: number | string) => number | string;
      value?: number | string;
      label: string;
      onBlur: () => unknown;
      touched: boolean;
      error?: string;
    } & GQLReactFormStandardProps
  > {}
export interface GQLFormStandardComponent<
  T extends GQLReactFormStandardProps = GQLReactFormStandardProps
> extends React.FC<T> {}
export interface GQLReactFormListItemProps extends GQLReactFormStandardProps {
  removeButton: JSX.Element | JSX.Element[];
  insertAboveButton: JSX.Element | JSX.Element[];
  idx: number;
}
export interface GQLReactFormListWrapperProps
  extends GQLReactFormStandardProps {
  totalInList: number;
  error?: string;
  touched: boolean;
}

export interface GQLReactFormScalarWrapperProps
  extends GQLReactFormStandardProps {
  error?: string;
  touched: boolean;
  label: string;
}

export interface GQLReactFormContext {
  form: GQLFormStandardComponent<
    GQLReactFormStandardProps & {
      onSubmit: (e?: { preventDefault?: () => any }) => any;
    }
  >;
  div: GQLFormStandardComponent;
  error: GQLFormStandardComponent;
  label: GQLFormStandardComponent;
  labelTextWrapper: GQLFormStandardComponent;
  button: GQLFormStandardComponent<GQLReactFormButtonProps>;
  addButton: GQLFormStandardComponent<GQLReactFormButtonProps>;
  removeButton: GQLFormStandardComponent<GQLReactFormButtonProps>;
  listWrapper: GQLFormStandardComponent<GQLReactFormListWrapperProps>;
  scalarWrapper: GQLFormStandardComponent<GQLReactFormScalarWrapperProps>;
  listItem: GQLFormStandardComponent<GQLReactFormListItemProps>;
  submitButton: React.FC<{ text: string; isValid: boolean }>;
  input: FormPrimeInput;
  UserInput?: React.FC<UserInputFormInputPropTypes>;
}
export const defaultReactFormContext: GQLReactFormContext = {
  form: 'form' as any,
  div: (props: GQLReactFormStandardProps) => <div {...props} />,
  error: (props: GQLReactFormStandardProps) => <div {...props} />,
  label: (props: GQLReactFormStandardProps) => <label {...props} />,
  labelTextWrapper: (props: GQLReactFormStandardProps) => <h4 {...props} />,
  button: (props: GQLReactFormButtonProps) => (
    <button
      {...props}
      onClick={(e) => {
        e.preventDefault();
        props.onClick?.();
      }}
    />
  ),
  addButton: (props: GQLReactFormButtonProps) => (
    <button
      {...props}
      onClick={(e) => {
        e.preventDefault();
        props.onClick?.();
      }}
    />
  ),
  removeButton: (props: GQLReactFormButtonProps) => (
    <button
      {...props}
      onClick={(e) => {
        e.preventDefault();
        props.onClick?.();
      }}
    />
  ),
  listWrapper: (props: GQLReactFormListWrapperProps) => {
    const DivComponent = useCustomizedComponent('div');
    const ErrorComponent = useCustomizedComponent('error');
    const { path, name, scalar, depth, ...olProps } = props;
    return (
      <DivComponent path={path} scalar={scalar} name={name} depth={depth}>
        <ErrorComponent path={path} scalar={scalar} name={name} depth={depth}>
          {props.touched && props.error}
        </ErrorComponent>
        <ol {...olProps}>{props.children}</ol>
      </DivComponent>
    );
  },
  scalarWrapper: (props: GQLReactFormScalarWrapperProps) => {
    const DivComponent = useCustomizedComponent('div');
    const LabelComponent = useCustomizedComponent('label');
    const LabelTextWrapperComponent = useCustomizedComponent(
      'labelTextWrapper'
    );
    const ErrorComponent = useCustomizedComponent('error');
    const { path, name, scalar, depth, label } = props;
    return (
      <DivComponent
        className={'mutationFormNested'}
        path={path}
        scalar={scalar}
        name={name}
        depth={depth}
      >
        <LabelComponent path={path} scalar={scalar} name={name} depth={depth}>
          <LabelTextWrapperComponent
            path={path}
            scalar={scalar}
            name={name}
            depth={depth}
          >
            {label}
          </LabelTextWrapperComponent>
        </LabelComponent>
        <ErrorComponent path={path} scalar={scalar} name={name} depth={depth}>
          {props.touched && props.error}
        </ErrorComponent>
        {props.children}
      </DivComponent>
    );
  },
  listItem: (props: GQLReactFormListItemProps) => {
    return (
      <li>
        {props.insertAboveButton}
        {props.removeButton}
        {props.children}
      </li>
    );
  },
  submitButton: ({
    text,
    isValid,
    ...props
  }: {
    text: string;
    isValid: boolean;
  }) => <input disabled={!isValid} type="submit" {...props} value={text} />,
  input: (props) => {
    const { path, scalar, name, depth, error, touched, onBlur } = props;
    const DivComponent = useCustomizedComponent('div');
    const LabelTextWrapperComponent = useCustomizedComponent(
      'labelTextWrapper'
    );
    const typeofValue = typeof props.value;
    const LabelComponent = useCustomizedComponent('label');
    return (
      <DivComponent path={path} scalar={scalar} name={name} depth={depth}>
        <LabelComponent path={path} scalar={scalar} name={name} depth={depth}>
          <LabelTextWrapperComponent
            path={path}
            scalar={scalar}
            name={name}
            depth={depth}
          >
            {props.label}
          </LabelTextWrapperComponent>
          <>
            <input
              value={props.value}
              type={
                props.value === undefined
                  ? 'string'
                  : typeofValue === 'string'
                  ? 'text'
                  : typeofValue === 'number'
                  ? 'number'
                  : ''
              }
              onBlur={onBlur}
              onChange={(e) => props.onChange(e.target.value)}
            />
            {!!error && !!touched && (
              <DivComponent
                className={'gql-form-generator-error'}
                path={path}
                scalar={scalar}
                name={name}
                depth={depth}
              >
                {error}
              </DivComponent>
            )}
          </>
        </LabelComponent>
      </DivComponent>
    );
  },
};
export const GQLReactFormContext = React.createContext<
  Partial<GQLReactFormContext>
>(defaultReactFormContext);
const _emptyFormContext = {};
export const InternalGQLReactFormContext = React.createContext<
  Partial<GQLReactFormContext>
>(_emptyFormContext);
function useCustomizedComponent<T extends keyof GQLReactFormContext>(
  name: T
): GQLReactFormContext[T] {
  const ctx = React.useContext(GQLReactFormContext);
  const _ctx = React.useContext(InternalGQLReactFormContext);
  let c: GQLReactFormContext[T] = (_ctx[name] ||
    ctx[name] ||
    defaultReactFormContext[name]) as GQLReactFormContext[T];
  return c;
}

/**********************
 * Default Values
 * *******************/
export const defaultUserInputScalar = {
  get id(): Scalars['Int'] | undefined {
    return JSON.parse(JSON.stringify(0));
  },

  get name(): Scalars['String'] {
    return JSON.parse(JSON.stringify(''));
  },

  get email(): Scalars['String'] {
    return JSON.parse(JSON.stringify(''));
  },

  get password(): Scalars['String'] | undefined {
    return JSON.parse(JSON.stringify(''));
  },

  get mother(): UserInput | undefined {
    return undefined;
  },

  get father(): UserInput | undefined {
    return undefined;
  },

  get friends(): UserInput[] {
    return JSON.parse(JSON.stringify([]));
  },

  get followers(): UserInput[] | undefined {
    return undefined;
  },
};

/**********************
 * Validation Types
 * *******************/
export type StringValidation = string;
export type IntValidation = string;
export type UserInputValidation =
  | {
      __meta?: string;
      id?: string;
      name: StringValidation;
      email: StringValidation;
      password?: StringValidation;
      mother: UserInputValidation;
      father?: UserInputValidation;
      friends: { __meta?: string; list: UserInputValidation[] };
      followers?: UserInputListValidation;
    }
  | string;
export type UserInputListValidation = {
  __meta?: string;
  list: UserInputValidation[];
};
/**********************
 * Scalar Form Fragments
 * *******************/

export interface StringFormInputPropTypes {
  optional: boolean;
  label: string;
  error?: StringValidation;
  value?: Maybe<Scalars['String']>;
  scalarName: string;
  name: string;
  parentPath: string;
  depth: number;
  onChange: (value?: Scalars['String']) => any;
}
export const StringFormInput = React.memo((props: StringFormInputPropTypes) => {
  const { parentPath, label, name, value, onChange, depth, error } = props;
  const [touched, setTouched] = React.useState(false);
  const setTouchedTrue = React.useCallback(() => setTouched(true), [
    setTouched,
  ]);
  const scalar = 'String';
  const path = [parentPath, name].join('.');
  const InputComponent = useCustomizedComponent('input');
  return (
    <InputComponent
      error={error}
      onBlur={setTouchedTrue}
      touched={touched}
      onChange={onChange as any}
      value={value === undefined || value === null ? '' : value}
      label={label}
      path={path}
      scalar={scalar}
      name={name}
      depth={depth}
    ></InputComponent>
  );
});

export interface IntFormInputPropTypes {
  optional: boolean;
  label: string;
  error?: IntValidation;
  value?: Maybe<Scalars['Int']>;
  scalarName: string;
  name: string;
  parentPath: string;
  depth: number;
  onChange: (value?: Scalars['Int']) => any;
}
export const IntFormInput = React.memo((props: IntFormInputPropTypes) => {
  const { parentPath, label, name, value, onChange, depth, error } = props;
  const [touched, setTouched] = React.useState(false);
  const setTouchedTrue = React.useCallback(() => setTouched(true), [
    setTouched,
  ]);
  const scalar = 'Int';
  const path = [parentPath, name].join('.');
  const InputComponent = useCustomizedComponent('input');
  return (
    <InputComponent
      error={error}
      onBlur={setTouchedTrue}
      touched={touched}
      onChange={onChange as any}
      value={value === undefined || value === null ? '' : value}
      label={label}
      path={path}
      scalar={scalar}
      name={name}
      depth={depth}
    ></InputComponent>
  );
});

export interface UserInputFormInputPropTypes {
  optional: boolean;
  label: string;
  error?: UserInputValidation;
  value?: Maybe<UserInput>;
  scalarName: string;
  name: string;
  parentPath: string;
  depth: number;
  onChange: (value?: UserInput) => any;
}
export const UserInputFormInput = React.memo(
  (props: UserInputFormInputPropTypes) => {
    const { parentPath, label, name, value, onChange, depth, error } = props;
    const [touched, setTouched] = React.useState(false);
    const setTouchedTrue = React.useCallback(() => setTouched(true), [
      setTouched,
    ]);
    const scalar = 'UserInput';
    const path = [parentPath, name].join('.');
    const metaError =
      error !== undefined
        ? typeof error === 'string'
          ? error
          : error.__meta
        : '';
    const DivComponent = useCustomizedComponent('div');
    const ScalarWrapperComponent = useCustomizedComponent('scalarWrapper');
    const ButtonComponent = useCustomizedComponent('button');

    const UserComponent = useCustomizedComponent(scalar);
    if (UserComponent) return <UserComponent {...props} />;

    if (value === undefined || value === null) {
      return (
        <DivComponent path={path} scalar={scalar} name={name} depth={depth}>
          <ButtonComponent
            onClick={() => {
              setTouchedTrue();
              onChange(JSON.parse(JSON.stringify(defaultUserInputScalar)));
            }}
            path={path}
            scalar={scalar}
            name={name}
            depth={depth}
          >
            Add {label}
          </ButtonComponent>
        </DivComponent>
      );
    }
    return (
      <ScalarWrapperComponent
        className={'mutationFormNested'}
        touched={touched}
        error={metaError}
        label={label}
        path={path}
        scalar={scalar}
        name={name}
        depth={depth}
      >
        <IntFormInput
          error={typeof error === 'string' ? undefined : error?.['id']}
          depth={depth + 1}
          value={value?.id === null ? undefined : value?.id}
          scalarName={'Int'}
          name={'id'}
          optional={true}
          label={'Id'}
          parentPath={path}
          onChange={(newValue = 0) => {
            setTouched(true);
            onChange({ ...value, ['id']: newValue });
          }}
        />
        <StringFormInput
          error={typeof error === 'string' ? undefined : error?.['name']}
          depth={depth + 1}
          value={value?.name === null ? undefined : value?.name}
          scalarName={'String'}
          name={'name'}
          optional={false}
          label={'Name'}
          parentPath={path}
          onChange={(newValue = '') => {
            setTouched(true);
            onChange({ ...value, ['name']: newValue });
          }}
        />
        <StringFormInput
          error={typeof error === 'string' ? undefined : error?.['email']}
          depth={depth + 1}
          value={value?.email === null ? undefined : value?.email}
          scalarName={'String'}
          name={'email'}
          optional={false}
          label={'Email'}
          parentPath={path}
          onChange={(newValue = '') => {
            setTouched(true);
            onChange({ ...value, ['email']: newValue });
          }}
        />
        <StringFormInput
          error={typeof error === 'string' ? undefined : error?.['password']}
          depth={depth + 1}
          value={value?.password === null ? undefined : value?.password}
          scalarName={'String'}
          name={'password'}
          optional={true}
          label={'Password'}
          parentPath={path}
          onChange={(newValue = '') => {
            setTouched(true);
            onChange({ ...value, ['password']: newValue });
          }}
        />
        <UserInputFormInput
          error={typeof error === 'string' ? undefined : error?.['mother']}
          depth={depth + 1}
          value={value?.mother === null ? undefined : value?.mother}
          scalarName={'UserInput'}
          name={'mother'}
          optional={true}
          label={'Mother'}
          parentPath={path}
          onChange={(
            newValue = JSON.parse(JSON.stringify(defaultUserInputScalar))
          ) => {
            setTouched(true);
            onChange({ ...value, ['mother']: newValue });
          }}
        />
        <UserInputFormInput
          error={typeof error === 'string' ? undefined : error?.['father']}
          depth={depth + 1}
          value={value?.father === null ? undefined : value?.father}
          scalarName={'UserInput'}
          name={'father'}
          optional={true}
          label={'Father'}
          parentPath={path}
          onChange={(
            newValue = JSON.parse(JSON.stringify(defaultUserInputScalar))
          ) => {
            setTouched(true);
            onChange({ ...value, ['father']: newValue });
          }}
        />
        <UserInputFormInputAsList
          error={typeof error === 'string' ? undefined : error?.['friends']}
          depth={depth + 1}
          value={value?.friends === null ? undefined : value?.friends}
          scalarName={'UserInput'}
          name={'friends'}
          optional={false}
          label={'Friends'}
          parentPath={path}
          onChange={(newValue = []) => {
            setTouched(true);
            onChange({ ...value, ['friends']: newValue });
          }}
        />
        <UserInputFormInputAsList
          error={typeof error === 'string' ? undefined : error?.['followers']}
          depth={depth + 1}
          value={value?.followers === null ? undefined : value?.followers}
          scalarName={'UserInput'}
          name={'followers'}
          optional={true}
          label={'Followers'}
          parentPath={path}
          onChange={(newValue = []) => {
            setTouched(true);
            onChange({ ...value, ['followers']: newValue });
          }}
        />
      </ScalarWrapperComponent>
    );
  }
);

export interface UserInputFormInputAsListPropTypes {
  optional: boolean;
  label: string;
  error?: UserInputListValidation;
  value?: Maybe<UserInput>[];
  scalarName: string;
  name: string;
  parentPath: string;
  depth: number;
  onChange: (value?: UserInput[]) => any;
}
export const UserInputFormInputAsList = React.memo(
  (props: UserInputFormInputAsListPropTypes) => {
    const { parentPath, label, name, value, onChange, depth, error } = props;
    const [touched, setTouched] = React.useState(false);
    const setTouchedTrue = React.useCallback(() => setTouched(true), [
      setTouched,
    ]);
    const scalar = 'UserInput';
    const path = [parentPath, name].join('.');
    const metaError =
      error !== undefined
        ? typeof error === 'string'
          ? error
          : error.__meta
        : '';
    const AddButtonComponent = useCustomizedComponent('addButton');
    const RemoveButtonComponent = useCustomizedComponent('removeButton');
    const ListItemComponent = useCustomizedComponent('listItem');
    const DivComponent = useCustomizedComponent('div');
    const LabelTextWrapperComponent = useCustomizedComponent(
      'labelTextWrapper'
    );
    const valueMapRef = React.useRef<{ id: string; value: Maybe<UserInput> }[]>(
      (value || []).map((v) => ({ id: uniqueId('friends'), value: v }))
    );
    const addItem = () => {
      setTouched(true);
      valueMapRef.current = [
        ...valueMapRef.current,
        {
          id: uniqueId('friends'),
          value: JSON.parse(JSON.stringify(defaultUserInputScalar)),
        },
      ];
      onChange(
        valueMapRef.current.map((i) =>
          i.value === null
            ? JSON.parse(JSON.stringify(defaultUserInputScalar))
            : i.value
        )
      );
    };
    const insertItem = (index: number) => {
      setTouched(true);
      valueMapRef.current = [
        ...valueMapRef.current.slice(0, index),
        {
          id: uniqueId('friends'),
          value: JSON.parse(JSON.stringify(defaultUserInputScalar)),
        },
        ...valueMapRef.current.slice(index),
      ];
      onChange(
        valueMapRef.current.map((i) =>
          i.value === null
            ? JSON.parse(JSON.stringify(defaultUserInputScalar))
            : i.value
        )
      );
    };
    const removeItem = (index: number) => {
      setTouched(true);
      valueMapRef.current = [
        ...valueMapRef.current.slice(0, index),
        ...valueMapRef.current.slice(index + 1),
      ];
      onChange(
        valueMapRef.current.map((i) =>
          i.value === null
            ? JSON.parse(JSON.stringify(defaultUserInputScalar))
            : i.value
        )
      );
    };
    const ListWrapperComponent = useCustomizedComponent('listWrapper');
    return (
      <DivComponent
        className={'mutationFormNested mutationFormList'}
        path={path}
        scalar={scalar}
        name={name}
        depth={depth}
      >
        {label && (
          <LabelTextWrapperComponent
            path={path}
            scalar={scalar}
            name={name}
            depth={depth}
          >
            {label}
          </LabelTextWrapperComponent>
        )}
        <ListWrapperComponent
          error={metaError}
          touched={touched}
          totalInList={valueMapRef.current.length}
          path={path}
          scalar={scalar}
          name={name}
          depth={depth}
        >
          {valueMapRef.current.map((item, index) => (
            <ListItemComponent
              idx={index}
              key={item.id}
              insertAboveButton={
                <AddButtonComponent
                  onClick={() => insertItem(index)}
                  path={path}
                  scalar={scalar}
                  name={name}
                  depth={depth}
                >
                  +
                </AddButtonComponent>
              }
              removeButton={
                <RemoveButtonComponent
                  onClick={() => removeItem(index)}
                  path={path}
                  scalar={scalar}
                  name={name}
                  depth={depth}
                >
                  X
                </RemoveButtonComponent>
              }
              path={path}
              scalar={scalar}
              name={name}
              depth={depth}
            >
              <UserInputFormInput
                optional={false}
                label={''}
                value={item.value}
                scalarName={'UserInput'}
                name={String(index)}
                parentPath={path}
                depth={depth}
                error={error?.list?.[index]}
                onChange={(
                  newValue = JSON.parse(JSON.stringify(defaultUserInputScalar))
                ) => {
                  valueMapRef.current = valueMapRef.current.map((i) =>
                    i.id === item.id ? { id: item.id, value: newValue } : i
                  );
                  onChange(
                    valueMapRef.current.map((i) =>
                      i.value === null
                        ? JSON.parse(JSON.stringify(defaultUserInputScalar))
                        : i.value
                    )
                  );
                }}
              />
            </ListItemComponent>
          ))}
          <AddButtonComponent
            onClick={addItem}
            path={path}
            scalar={scalar}
            name={name}
            depth={depth}
          >
            +
          </AddButtonComponent>
        </ListWrapperComponent>
      </DivComponent>
    );
  }
);

/***************************
 * forms Forms
 * *************************/

export const addUserDefaultValues = {
  email: '',
  name: '',
  password: '',
};

export interface AddUserFormVariables {
  email: Scalars['String'];
  name: Scalars['String'];
  password?: Scalars['String'];
}
export interface ValidateAddUserForm extends IGenericFormValidationResult {
  email: string;
  name: StringValidation;
  password?: StringValidation;
}

type AddUserFormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  initialValues?: Partial<AddUserFormVariables>;
  validate?: (value: Partial<AddUserFormVariables>) => ValidateAddUserForm;
  onSubmit: (values: AddUserFormVariables) => any;
};
export const _AddUserForm = ({
  initialValues = addUserDefaultValues,
  onSubmit,
  validate,
  ...formProps
}: AddUserFormProps) => {
  const [value, setValue] = React.useState(initialValues || {});
  const [validationResults, setValidationResults] = React.useState(() =>
    validate ? validate(initialValues) : ({} as ValidateAddUserForm)
  );
  const FormComponent = useCustomizedComponent('form');
  const SubmitButtonComponent = useCustomizedComponent('submitButton');
  const isValid = isValidFromFormResult(validationResults);
  return (
    <FormComponent
      scalar=""
      name=""
      depth={0}
      onSubmit={(e) => {
        e?.preventDefault?.();
        if (!isValid) return false;
        onSubmit(value as any);
      }}
      {...formProps}
      path=""
    >
      <StringFormInput
        value={value?.email}
        label={'Email'}
        parentPath={'root'}
        depth={0}
        error={
          typeof validationResults === 'string'
            ? undefined
            : validationResults['email']
        }
        onChange={(value) => {
          setValue((oldVal) => {
            const newValue = { ...oldVal, ['email']: value };
            if (validate) setValidationResults(validate(newValue));
            return newValue;
          });
        }}
        scalarName={'String'}
        name={'email'}
        optional={false}
      />
      <StringFormInput
        value={value?.name}
        label={'Name'}
        parentPath={'root'}
        depth={0}
        error={
          typeof validationResults === 'string'
            ? undefined
            : validationResults['name']
        }
        onChange={(value) => {
          setValue((oldVal) => {
            const newValue = { ...oldVal, ['name']: value };
            if (validate) setValidationResults(validate(newValue));
            return newValue;
          });
        }}
        scalarName={'String'}
        name={'name'}
        optional={false}
      />
      <StringFormInput
        value={value?.password}
        label={'Password'}
        parentPath={'root'}
        depth={0}
        error={
          typeof validationResults === 'string'
            ? undefined
            : validationResults['password']
        }
        onChange={(value) => {
          setValue((oldVal) => {
            const newValue = { ...oldVal, ['password']: value };
            if (validate) setValidationResults(validate(newValue));
            return newValue;
          });
        }}
        scalarName={'String'}
        name={'password'}
        optional={true}
      />
      <SubmitButtonComponent isValid={isValid} text="submit" />
    </FormComponent>
  );
};
export const AddUserForm = ({
  customComponents = _emptyFormContext,
  ...props
}: AddUserFormProps & { customComponents?: Partial<GQLReactFormContext> }) => {
  return (
    <InternalGQLReactFormContext.Provider value={customComponents}>
      <_AddUserForm {...props} />
    </InternalGQLReactFormContext.Provider>
  );
};

export const addUserFromObjectDefaultValues = {
  user: JSON.parse(JSON.stringify(defaultUserInputScalar)),
};

export interface AddUserFromObjectFormVariables {
  user: UserInput;
}
export interface ValidateAddUserFromObjectForm
  extends IGenericFormValidationResult {
  user:
    | {
        __meta?: string;
        id?: string;
        name: StringValidation;
        email: StringValidation;
        password?: StringValidation;
        mother: UserInputValidation;
        father?: UserInputValidation;
        friends: { __meta?: string; list: UserInputValidation[] };
        followers?: UserInputListValidation;
      }
    | string;
}

type AddUserFromObjectFormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  initialValues?: Partial<AddUserFromObjectFormVariables>;
  validate?: (
    value: Partial<AddUserFromObjectFormVariables>
  ) => ValidateAddUserFromObjectForm;
  onSubmit: (values: AddUserFromObjectFormVariables) => any;
};
export const _AddUserFromObjectForm = ({
  initialValues = addUserFromObjectDefaultValues,
  onSubmit,
  validate,
  ...formProps
}: AddUserFromObjectFormProps) => {
  const [value, setValue] = React.useState(initialValues || {});
  const [validationResults, setValidationResults] = React.useState(() =>
    validate ? validate(initialValues) : ({} as ValidateAddUserFromObjectForm)
  );
  const FormComponent = useCustomizedComponent('form');
  const SubmitButtonComponent = useCustomizedComponent('submitButton');
  const isValid = isValidFromFormResult(validationResults);
  return (
    <FormComponent
      scalar=""
      name=""
      depth={0}
      onSubmit={(e) => {
        e?.preventDefault?.();
        if (!isValid) return false;
        onSubmit(value as any);
      }}
      {...formProps}
      path=""
    >
      <UserInputFormInput
        value={value?.user}
        label={'User'}
        parentPath={'root'}
        depth={0}
        error={
          typeof validationResults === 'string'
            ? undefined
            : validationResults['user']
        }
        onChange={(value) => {
          setValue((oldVal) => {
            const newValue = { ...oldVal, ['user']: value };
            if (validate) setValidationResults(validate(newValue));
            return newValue;
          });
        }}
        scalarName={'UserInput'}
        name={'user'}
        optional={false}
      />
      <SubmitButtonComponent isValid={isValid} text="submit" />
    </FormComponent>
  );
};
export const AddUserFromObjectForm = ({
  customComponents = _emptyFormContext,
  ...props
}: AddUserFromObjectFormProps & {
  customComponents?: Partial<GQLReactFormContext>;
}) => {
  return (
    <InternalGQLReactFormContext.Provider value={customComponents}>
      <_AddUserFromObjectForm {...props} />
    </InternalGQLReactFormContext.Provider>
  );
};

export const addUsersFromListDefaultValues = {
  users: [],
};

export interface AddUsersFromListFormVariables {
  users: UserInput[];
}
export interface ValidateAddUsersFromListForm
  extends IGenericFormValidationResult {
  users: UserInputListValidation;
}

type AddUsersFromListFormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  initialValues?: Partial<AddUsersFromListFormVariables>;
  validate?: (
    value: Partial<AddUsersFromListFormVariables>
  ) => ValidateAddUsersFromListForm;
  onSubmit: (values: AddUsersFromListFormVariables) => any;
};
export const _AddUsersFromListForm = ({
  initialValues = addUsersFromListDefaultValues,
  onSubmit,
  validate,
  ...formProps
}: AddUsersFromListFormProps) => {
  const [value, setValue] = React.useState(initialValues || {});
  const [validationResults, setValidationResults] = React.useState(() =>
    validate ? validate(initialValues) : ({} as ValidateAddUsersFromListForm)
  );
  const FormComponent = useCustomizedComponent('form');
  const SubmitButtonComponent = useCustomizedComponent('submitButton');
  const isValid = isValidFromFormResult(validationResults);
  return (
    <FormComponent
      scalar=""
      name=""
      depth={0}
      onSubmit={(e) => {
        e?.preventDefault?.();
        if (!isValid) return false;
        onSubmit(value as any);
      }}
      {...formProps}
      path=""
    >
      <UserInputFormInputAsList
        value={value?.users}
        label={'Users'}
        parentPath={'root'}
        depth={0}
        error={
          typeof validationResults === 'string'
            ? undefined
            : validationResults['users']
        }
        onChange={(value) => {
          setValue((oldVal) => {
            const newValue = { ...oldVal, ['users']: value };
            if (validate) setValidationResults(validate(newValue));
            return newValue;
          });
        }}
        scalarName={'UserInput'}
        name={'users'}
        optional={false}
      />
      <SubmitButtonComponent isValid={isValid} text="submit" />
    </FormComponent>
  );
};
export const AddUsersFromListForm = ({
  customComponents = _emptyFormContext,
  ...props
}: AddUsersFromListFormProps & {
  customComponents?: Partial<GQLReactFormContext>;
}) => {
  return (
    <InternalGQLReactFormContext.Provider value={customComponents}>
      <_AddUsersFromListForm {...props} />
    </InternalGQLReactFormContext.Provider>
  );
};
