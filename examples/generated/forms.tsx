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
  // idx: number
  totalInList: number;
}

export interface GQLReactFormContext {
  form: GQLFormStandardComponent<
    GQLReactFormStandardProps & {
      onSubmit: (e?: { preventDefault?: () => any }) => any;
    }
  >;
  div: GQLFormStandardComponent;
  label: GQLFormStandardComponent;
  labelTextWrapper: GQLFormStandardComponent;
  button: GQLFormStandardComponent<GQLReactFormButtonProps>;
  addButton: GQLFormStandardComponent<GQLReactFormButtonProps>;
  removeButton: GQLFormStandardComponent<GQLReactFormButtonProps>;
  listWrapper: GQLFormStandardComponent<GQLReactFormListWrapperProps>;
  listItem: GQLFormStandardComponent<GQLReactFormListItemProps>;
  submitButton: React.FC<{ text: string }>;
  input: FormPrimeInput;
  UserInput?: React.FC<UserInputFormInputPropTypes>;
}
export const defaultReactFormContext: GQLReactFormContext = {
  form: 'form' as any,
  div: ({ ...props }: GQLReactFormStandardProps) => <div {...props} />,
  label: ({ ...props }: GQLReactFormStandardProps) => <label {...props} />,
  labelTextWrapper: ({ ...props }: GQLReactFormStandardProps) => (
    <h4 {...props} />
  ),
  button: ({ ...props }: GQLReactFormButtonProps) => (
    <button
      {...props}
      onClick={(e) => {
        e.preventDefault();
        props.onClick?.();
      }}
    />
  ),
  addButton: ({ ...props }: GQLReactFormButtonProps) => (
    <button
      {...props}
      onClick={(e) => {
        e.preventDefault();
        props.onClick?.();
      }}
    />
  ),
  removeButton: ({ ...props }: GQLReactFormButtonProps) => (
    <button
      {...props}
      onClick={(e) => {
        e.preventDefault();
        props.onClick?.();
      }}
    />
  ),
  listWrapper: ({ ...props }: GQLReactFormStandardProps) => <ol {...props} />,
  listItem: (props: GQLReactFormListItemProps) => {
    return (
      <li>
        {props.insertAboveButton}
        {props.removeButton}
        {props.children}
      </li>
    );
  },
  submitButton: (props: { text: string }) => (
    <input type="submit" {...props} value={props.text} />
  ),
  input: (props) => {
    const { path, scalar, name, depth } = props;
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
            onChange={(e) => props.onChange(e.target.value)}
          />
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
export type StringValidationFn = (props: {
  value: Scalars['String'];
  touched: boolean;
}) => string;
export type IntValidationFn = (props: {
  value: Scalars['Int'];
  touched: boolean;
}) => string;
export type UserInputValidationFn = {
  id?: (props: { value: Scalars['Int']; touched: boolean }) => string;
  name: StringValidationFn;
  email: StringValidationFn;
  password: StringValidationFn;
  mother?: (props: {
    value: UserInput;
    touched: boolean;
  }) => UserInputValidationFn;
  father: UserInputValidationFn;
  friendsListValidationFN: {
    list: (props: { value: UserInput[]; touched: boolean }) => string;
    items: (
      props: {
        value: UserInput;
        touched: boolean;
      },
      index: number
    ) => string;
  };
  followers: UserInputValidationFnAsList;
};
export type UserInputValidationFnAsList = {
  list: (props: { value: UserInput[]; touched: boolean }) => string;
  items: (
    props: {
      value: UserInput;
      touched: boolean;
    },
    index: number
  ) => string;
};
/**********************
 * Scalar Form Fragments
 * *******************/

export interface StringFormInputPropTypes {
  optional: boolean;
  label: string;
  value?: Maybe<Scalars['String']>;
  scalarName: string;
  name: string;
  validate?: StringValidationFn;
  parentPath: string;
  depth: number;
  onChange: (value?: Scalars['String']) => any;
}
export const StringFormInput = React.memo((props: StringFormInputPropTypes) => {
  const { parentPath, label, name, value, onChange, depth } = props;
  const scalar = 'String';
  const path = [parentPath, name].join('.');
  const InputComponent = useCustomizedComponent('input');
  const [touched, setTouched] = React.useState(
    value !== undefined && value !== null
  );
  const setTouchedTrue = React.useCallback(() => setTouched(true), [
    setTouched,
  ]);
  return (
    <InputComponent
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
  value?: Maybe<Scalars['Int']>;
  scalarName: string;
  name: string;
  validate?: IntValidationFn;
  parentPath: string;
  depth: number;
  onChange: (value?: Scalars['Int']) => any;
}
export const IntFormInput = React.memo((props: IntFormInputPropTypes) => {
  const { parentPath, label, name, value, onChange, depth } = props;
  const scalar = 'Int';
  const path = [parentPath, name].join('.');
  const InputComponent = useCustomizedComponent('input');
  const [touched, setTouched] = React.useState(
    value !== undefined && value !== null
  );
  const setTouchedTrue = React.useCallback(() => setTouched(true), [
    setTouched,
  ]);
  return (
    <InputComponent
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
  value?: Maybe<UserInput>;
  scalarName: string;
  name: string;
  validate?: UserInputValidationFn;
  parentPath: string;
  depth: number;
  onChange: (value?: UserInput) => any;
}
export const UserInputFormInput = React.memo(
  (props: UserInputFormInputPropTypes) => {
    const { parentPath, label, name, value, onChange, depth } = props;
    const scalar = 'UserInput';
    const path = [parentPath, name].join('.');
    const DivComponent = useCustomizedComponent('div');
    const ButtonComponent = useCustomizedComponent('button');
    const LabelTextWrapperComponent = useCustomizedComponent(
      'labelTextWrapper'
    );

    const UserComponent = useCustomizedComponent(scalar);
    if (UserComponent) return <UserComponent {...props} />;

    if (value === undefined || value === null) {
      return (
        <DivComponent path={path} scalar={scalar} name={name} depth={depth}>
          <ButtonComponent
            onClick={() =>
              onChange(JSON.parse(JSON.stringify(defaultUserInputScalar)))
            }
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
      <DivComponent
        className={'mutationFormNested'}
        path={path}
        scalar={scalar}
        name={name}
        depth={depth}
      >
        <LabelTextWrapperComponent
          path={path}
          scalar={scalar}
          name={name}
          depth={depth}
        >
          {label}
        </LabelTextWrapperComponent>
        <IntFormInput
          depth={depth + 1}
          value={value?.id === null ? undefined : value?.id}
          scalarName={'Int'}
          name={'id'}
          optional={true}
          label={'Id'}
          parentPath={path}
          onChange={(newValue = 0) => onChange({ ...value, ['id']: newValue })}
        />
        <StringFormInput
          depth={depth + 1}
          value={value?.name === null ? undefined : value?.name}
          scalarName={'String'}
          name={'name'}
          optional={false}
          label={'Name'}
          parentPath={path}
          onChange={(newValue = '') =>
            onChange({ ...value, ['name']: newValue })
          }
        />
        <StringFormInput
          depth={depth + 1}
          value={value?.email === null ? undefined : value?.email}
          scalarName={'String'}
          name={'email'}
          optional={false}
          label={'Email'}
          parentPath={path}
          onChange={(newValue = '') =>
            onChange({ ...value, ['email']: newValue })
          }
        />
        <StringFormInput
          depth={depth + 1}
          value={value?.password === null ? undefined : value?.password}
          scalarName={'String'}
          name={'password'}
          optional={true}
          label={'Password'}
          parentPath={path}
          onChange={(newValue = '') =>
            onChange({ ...value, ['password']: newValue })
          }
        />
        <UserInputFormInput
          depth={depth + 1}
          value={value?.mother === null ? undefined : value?.mother}
          scalarName={'UserInput'}
          name={'mother'}
          optional={true}
          label={'Mother'}
          parentPath={path}
          onChange={(
            newValue = JSON.parse(JSON.stringify(defaultUserInputScalar))
          ) => onChange({ ...value, ['mother']: newValue })}
        />
        <UserInputFormInput
          depth={depth + 1}
          value={value?.father === null ? undefined : value?.father}
          scalarName={'UserInput'}
          name={'father'}
          optional={true}
          label={'Father'}
          parentPath={path}
          onChange={(
            newValue = JSON.parse(JSON.stringify(defaultUserInputScalar))
          ) => onChange({ ...value, ['father']: newValue })}
        />
        <UserInputFormInputAsList
          depth={depth + 1}
          value={value?.friends === null ? undefined : value?.friends}
          scalarName={'UserInput'}
          name={'friends'}
          optional={false}
          label={'Friends'}
          parentPath={path}
          onChange={(newValue = []) =>
            onChange({ ...value, ['friends']: newValue })
          }
        />
        <UserInputFormInputAsList
          depth={depth + 1}
          value={value?.followers === null ? undefined : value?.followers}
          scalarName={'UserInput'}
          name={'followers'}
          optional={true}
          label={'Followers'}
          parentPath={path}
          onChange={(newValue = []) =>
            onChange({ ...value, ['followers']: newValue })
          }
        />
      </DivComponent>
    );
  }
);

export interface UserInputFormInputAsListPropTypes {
  optional: boolean;
  label: string;
  value?: Maybe<UserInput>[];
  scalarName: string;
  name: string;
  validate?: UserInputValidationFnAsList;
  parentPath: string;
  depth: number;
  onChange: (value?: UserInput[]) => any;
}
export const UserInputFormInputAsList = React.memo(
  (props: UserInputFormInputAsListPropTypes) => {
    const { parentPath, label, name, value, onChange, depth } = props;
    const scalar = 'UserInput';
    const path = [parentPath, name].join('.');
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
export interface ValidateAddUserForm {
  email: (props: { value: Scalars['String']; touched: boolean }) => string;
  name: StringValidationFn;
  password: StringValidationFn;
}

type AddUserFormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  initialValues?: Partial<AddUserFormVariables>;
  validate?: ValidateAddUserForm;
  onSubmit: (values: AddUserFormVariables) => any;
};
export const _AddUserForm = ({
  initialValues = addUserDefaultValues,
  onSubmit,
  validate,
  ...formProps
}: AddUserFormProps) => {
  const [value, setValue] = React.useState(initialValues || {});
  const FormComponent = useCustomizedComponent('form');
  const SubmitButtonComponent = useCustomizedComponent('submitButton');
  return (
    <FormComponent
      scalar=""
      name=""
      depth={0}
      onSubmit={(e) => {
        e?.preventDefault?.();
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
        validate={validate ? validate['email'] : undefined}
        onChange={(value) => {
          setValue((oldVal) => ({ ...oldVal, ['email']: value }));
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
        validate={validate ? validate['name'] : undefined}
        onChange={(value) => {
          setValue((oldVal) => ({ ...oldVal, ['name']: value }));
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
        validate={validate ? validate['password'] : undefined}
        onChange={(value) => {
          setValue((oldVal) => ({ ...oldVal, ['password']: value }));
        }}
        scalarName={'String'}
        name={'password'}
        optional={true}
      />
      <SubmitButtonComponent text="submit" />
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
export interface ValidateAddUserFromObjectForm {
  user: {
    id?: (props: { value: Scalars['Int']; touched: boolean }) => string;
    name: StringValidationFn;
    email: StringValidationFn;
    password: StringValidationFn;
    mother?: (props: {
      value: UserInput;
      touched: boolean;
    }) => UserInputValidationFn;
    father: UserInputValidationFn;
    friendsListValidationFN: {
      list: (props: { value: UserInput[]; touched: boolean }) => string;
      items: (
        props: {
          value: UserInput;
          touched: boolean;
        },
        index: number
      ) => string;
    };
    followers: UserInputValidationFnAsList;
  };
}

type AddUserFromObjectFormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  initialValues?: Partial<AddUserFromObjectFormVariables>;
  validate?: ValidateAddUserFromObjectForm;
  onSubmit: (values: AddUserFromObjectFormVariables) => any;
};
export const _AddUserFromObjectForm = ({
  initialValues = addUserFromObjectDefaultValues,
  onSubmit,
  validate,
  ...formProps
}: AddUserFromObjectFormProps) => {
  const [value, setValue] = React.useState(initialValues || {});
  const FormComponent = useCustomizedComponent('form');
  const SubmitButtonComponent = useCustomizedComponent('submitButton');
  return (
    <FormComponent
      scalar=""
      name=""
      depth={0}
      onSubmit={(e) => {
        e?.preventDefault?.();
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
        validate={validate ? validate['user'] : undefined}
        onChange={(value) => {
          setValue((oldVal) => ({ ...oldVal, ['user']: value }));
        }}
        scalarName={'UserInput'}
        name={'user'}
        optional={false}
      />
      <SubmitButtonComponent text="submit" />
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
export interface ValidateAddUsersFromListForm {
  users: UserInputValidationFnAsList;
}

type AddUsersFromListFormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  initialValues?: Partial<AddUsersFromListFormVariables>;
  validate?: ValidateAddUsersFromListForm;
  onSubmit: (values: AddUsersFromListFormVariables) => any;
};
export const _AddUsersFromListForm = ({
  initialValues = addUsersFromListDefaultValues,
  onSubmit,
  validate,
  ...formProps
}: AddUsersFromListFormProps) => {
  const [value, setValue] = React.useState(initialValues || {});
  const FormComponent = useCustomizedComponent('form');
  const SubmitButtonComponent = useCustomizedComponent('submitButton');
  return (
    <FormComponent
      scalar=""
      name=""
      depth={0}
      onSubmit={(e) => {
        e?.preventDefault?.();
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
        validate={validate ? validate['users'] : undefined}
        onChange={(value) => {
          setValue((oldVal) => ({ ...oldVal, ['users']: value }));
        }}
        scalarName={'UserInput'}
        name={'users'}
        optional={false}
      />
      <SubmitButtonComponent text="submit" />
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
