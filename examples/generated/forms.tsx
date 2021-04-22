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

export type AddUsersMutationVariables = Exact<{
  users: Array<Maybe<UserInput>> | Maybe<UserInput>;
}>;

export type AddUsersMutation = { __typename?: 'MutationRoot' } & {
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

interface StandardProps {
  children?: React.ReactNode;
  path: string;
  id?: string;
  className?: string;
  name: string;
  scalar: string;
}
interface FormPrimeInput
  extends React.FC<
    {
      onChange: (value: number | string) => number | string;
      value?: number | string;
      label: string;
    } & StandardProps
  > {}
interface GQLFormStandardComponent<T = {}>
  extends React.FC<StandardProps & T> {}
export interface GQLReactFormContext {
  form: GQLFormStandardComponent<{
    onSubmit: (e?: { preventDefault?: () => any }) => any;
  }>;
  div: GQLFormStandardComponent;
  label: GQLFormStandardComponent;
  labelTextWrapper: GQLFormStandardComponent;
  button: GQLFormStandardComponent<{
    onClick?: (e?: { preventDefault?: () => any }) => any;
  }>;
  listWrapper: GQLFormStandardComponent;
  listItem: GQLFormStandardComponent;
  submitButton: React.FC<{ text: string }>;
  input: FormPrimeInput;
  UserInput?: React.FC<UserInputFormInputPropTypes>;
}
export const defaultReactFormContext: GQLReactFormContext = {
  form: 'form' as any,
  div: ({ ...props }: StandardProps) => <div {...props} />,
  label: ({ ...props }: StandardProps) => <label {...props} />,
  labelTextWrapper: ({ ...props }: StandardProps) => <h4 {...props} />,
  button: ({
    ...props
  }: StandardProps & {
    onClick?: (e?: { preventDefault: () => any }) => any;
  }) => (
    <button
      {...props}
      onClick={(e) => {
        e.preventDefault();
        props.onClick?.();
      }}
    />
  ),
  listWrapper: ({ ...props }: StandardProps) => <ol {...props} />,
  listItem: ({ ...props }: StandardProps) => <li {...props} />,
  submitButton: (props: { text: string }) => (
    <input type="submit" {...props} value={props.text} />
  ),
  input: (props) => {
    const { path, scalar, name } = props;
    const ctx = React.useContext(GQLReactFormContext);
    const DivComponent = ctx.div || defaultReactFormContext.div;
    const typeofValue = typeof props.value;
    return (
      <DivComponent path={path} scalar={scalar} name={name}>
        <label>
          <strong>{props.label}</strong>
          <br />
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
        </label>
      </DivComponent>
    );
  },
};
export const GQLReactFormContext = React.createContext<
  Partial<GQLReactFormContext>
>(defaultReactFormContext);

/**********************
 * Default Values
 * *******************/
export const defaultUserInputScalar = {
  get id(): Scalars['Int'] | undefined {
    return JSON.parse(JSON.stringify(0));
  },

  get name(): Scalars['String'] | undefined {
    return JSON.parse(JSON.stringify(''));
  },

  get email(): Scalars['String'] | undefined {
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

  get followers(): UserInput | undefined {
    return undefined;
  },
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
  parentPath: string;
  onChange: (value?: Scalars['String']) => any;
}
export const StringFormInput = React.memo((props: StringFormInputPropTypes) => {
  const { parentPath, label, name, value, onChange } = props;
  const scalar = 'String';
  const path = [parentPath, name].join('.');
  const ctx = React.useContext(GQLReactFormContext);
  const DivComponent = ctx.div || defaultReactFormContext.div;
  const ButtonComponent = ctx.button || defaultReactFormContext.button;
  const LabelTextWrapperComponent =
    ctx.labelTextWrapper || defaultReactFormContext.labelTextWrapper;
  const InputComponent = ctx.input || defaultReactFormContext.input;
  return (
    <InputComponent
      onChange={props.onChange as any}
      value={value === undefined || value === null ? '' : value}
      label={label}
      path={path}
      scalar={scalar}
      name={name}
    ></InputComponent>
  );
});

export interface IntFormInputPropTypes {
  optional: boolean;
  label: string;
  value?: Maybe<Scalars['Int']>;
  scalarName: string;
  name: string;
  parentPath: string;
  onChange: (value?: Scalars['Int']) => any;
}
export const IntFormInput = React.memo((props: IntFormInputPropTypes) => {
  const { parentPath, label, name, value, onChange } = props;
  const scalar = 'Int';
  const path = [parentPath, name].join('.');
  const ctx = React.useContext(GQLReactFormContext);
  const DivComponent = ctx.div || defaultReactFormContext.div;
  const ButtonComponent = ctx.button || defaultReactFormContext.button;
  const LabelTextWrapperComponent =
    ctx.labelTextWrapper || defaultReactFormContext.labelTextWrapper;
  const InputComponent = ctx.input || defaultReactFormContext.input;
  return (
    <InputComponent
      onChange={props.onChange as any}
      value={value === undefined || value === null ? '' : value}
      label={label}
      path={path}
      scalar={scalar}
      name={name}
    ></InputComponent>
  );
});

export interface UserInputFormInputPropTypes {
  optional: boolean;
  label: string;
  value?: Maybe<UserInput>;
  scalarName: string;
  name: string;
  parentPath: string;
  onChange: (value?: UserInput) => any;
}
export const UserInputFormInput = React.memo(
  (props: UserInputFormInputPropTypes) => {
    const { parentPath, label, name, value, onChange } = props;
    const scalar = 'UserInput';
    const path = [parentPath, name].join('.');
    const ctx = React.useContext(GQLReactFormContext);
    const DivComponent = ctx.div || defaultReactFormContext.div;
    const ButtonComponent = ctx.button || defaultReactFormContext.button;
    const LabelTextWrapperComponent =
      ctx.labelTextWrapper || defaultReactFormContext.labelTextWrapper;

    if (value === undefined || value === null) {
      return (
        <DivComponent path={path} scalar={scalar} name={name}>
          <ButtonComponent
            onClick={() =>
              onChange(JSON.parse(JSON.stringify(defaultUserInputScalar)))
            }
            path={path}
            scalar={scalar}
            name={name}
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
      >
        <LabelTextWrapperComponent path={path} scalar={scalar} name={name}>
          {label}
        </LabelTextWrapperComponent>
        <IntFormInput
          value={value?.id === null ? undefined : value?.id}
          scalarName={'Int'}
          name={'id'}
          optional={true}
          label={'Id'}
          parentPath={path}
          onChange={(newValue = 0) => onChange({ ...value, ['id']: newValue })}
        />
        <StringFormInput
          value={value?.name === null ? undefined : value?.name}
          scalarName={'String'}
          name={'name'}
          optional={true}
          label={'Name'}
          parentPath={path}
          onChange={(newValue = '') =>
            onChange({ ...value, ['name']: newValue })
          }
        />
        <StringFormInput
          value={value?.email === null ? undefined : value?.email}
          scalarName={'String'}
          name={'email'}
          optional={true}
          label={'Email'}
          parentPath={path}
          onChange={(newValue = '') =>
            onChange({ ...value, ['email']: newValue })
          }
        />
        <StringFormInput
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
        <UserInputFormInput
          value={value?.followers === null ? undefined : value?.followers}
          scalarName={'UserInput'}
          name={'followers'}
          optional={true}
          label={'Followers'}
          parentPath={path}
          onChange={(
            newValue = JSON.parse(JSON.stringify(defaultUserInputScalar))
          ) => onChange({ ...value, ['followers']: newValue })}
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
  parentPath: string;
  onChange: (value?: UserInput[]) => any;
}
export const UserInputFormInputAsList = React.memo(
  (props: UserInputFormInputAsListPropTypes) => {
    const { parentPath, label, name, value, onChange } = props;
    const scalar = 'UserInput';
    const path = [parentPath, name].join('.');
    const ctx = React.useContext(GQLReactFormContext);
    const DivComponent = ctx.div || defaultReactFormContext.div;
    const ButtonComponent = ctx.button || defaultReactFormContext.button;
    const LabelTextWrapperComponent =
      ctx.labelTextWrapper || defaultReactFormContext.labelTextWrapper;
    const ListItemComponent = ctx.listItem || defaultReactFormContext.listItem;
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
    const ListWrapperComponent =
      ctx.listWrapper || defaultReactFormContext.listWrapper;
    return (
      <DivComponent
        className={'mutationFormNested mutationFormList'}
        path={path}
        scalar={scalar}
        name={name}
      >
        {label && (
          <LabelTextWrapperComponent path={path} scalar={scalar} name={name}>
            {label}
          </LabelTextWrapperComponent>
        )}
        <ListWrapperComponent path={path} scalar={scalar} name={name}>
          {valueMapRef.current.length > 0 ? (
            valueMapRef.current.map((item, index) => (
              <ListItemComponent
                key={item.id}
                path={path}
                scalar={scalar}
                name={name}
              >
                <ButtonComponent
                  onClick={() => removeItem(index)}
                  path={path}
                  scalar={scalar}
                  name={name}
                >
                  X
                </ButtonComponent>

                <ButtonComponent
                  onClick={() => insertItem(index)}
                  path={path}
                  scalar={scalar}
                  name={name}
                >
                  +
                </ButtonComponent>
                <UserInputFormInput
                  optional={false}
                  label={''}
                  value={item.value}
                  scalarName={'UserInput'}
                  name={String(index)}
                  parentPath={path}
                  onChange={(
                    newValue = JSON.parse(
                      JSON.stringify(defaultUserInputScalar)
                    )
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
            ))
          ) : (
            <ButtonComponent
              onClick={addItem}
              path={path}
              scalar={scalar}
              name={name}
            >
              +
            </ButtonComponent>
          )}
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

export const AddUserForm = ({
  initialValues = addUserDefaultValues,
  onSubmit,
  ...formProps
}: React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  initialValues?: Partial<AddUserFormVariables>;
  onSubmit: (values: AddUserFormVariables) => any;
}) => {
  const [value, setValue] = React.useState(initialValues || {});
  const ctx = React.useContext(GQLReactFormContext);
  const FormComponent = ctx.form || defaultReactFormContext.form;
  const SubmitButtonComponent =
    ctx.submitButton || defaultReactFormContext.submitButton;
  return (
    <FormComponent
      scalar=""
      name=""
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
        onChange={(value) => {
          console.log('onChange email', value);
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
        onChange={(value) => {
          console.log('onChange name', value);
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
        onChange={(value) => {
          console.log('onChange password', value);
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

export const addUserFromObjectDefaultValues = {
  user: JSON.parse(JSON.stringify(defaultUserInputScalar)),
};

export interface AddUserFromObjectFormVariables {
  user: UserInput;
}

export const AddUserFromObjectForm = ({
  initialValues = addUserFromObjectDefaultValues,
  onSubmit,
  ...formProps
}: React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  initialValues?: Partial<AddUserFromObjectFormVariables>;
  onSubmit: (values: AddUserFromObjectFormVariables) => any;
}) => {
  const [value, setValue] = React.useState(initialValues || {});
  const ctx = React.useContext(GQLReactFormContext);
  const FormComponent = ctx.form || defaultReactFormContext.form;
  const SubmitButtonComponent =
    ctx.submitButton || defaultReactFormContext.submitButton;
  return (
    <FormComponent
      scalar=""
      name=""
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
        onChange={(value) => {
          console.log('onChange user', value);
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

export const addUsersDefaultValues = {
  users: [],
};

export interface AddUsersFormVariables {
  users: UserInput[];
}

export const AddUsersForm = ({
  initialValues = addUsersDefaultValues,
  onSubmit,
  ...formProps
}: React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  initialValues?: Partial<AddUsersFormVariables>;
  onSubmit: (values: AddUsersFormVariables) => any;
}) => {
  const [value, setValue] = React.useState(initialValues || {});
  const ctx = React.useContext(GQLReactFormContext);
  const FormComponent = ctx.form || defaultReactFormContext.form;
  const SubmitButtonComponent =
    ctx.submitButton || defaultReactFormContext.submitButton;
  return (
    <FormComponent
      scalar=""
      name=""
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
        onChange={(value) => {
          console.log('onChange users', value);
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

/***************************
 * MetaData Export
 * *************************/

export const mutationsMetaData = [
  {
    name: 'addUser',
    variables: [
      {
        accessChain: ['String'],
        endedFromCycle: false,
        scalarName: 'String',
        name: 'email',
        tsType: 'Scalars["String"]',
        optional: false,
        asList: false,
        children: null,
      },
      {
        accessChain: ['String'],
        endedFromCycle: false,
        scalarName: 'String',
        name: 'name',
        tsType: 'Scalars["String"]',
        optional: false,
        asList: false,
        children: null,
      },
      {
        accessChain: ['String'],
        endedFromCycle: false,
        scalarName: 'String',
        name: 'password',
        tsType: 'Scalars["String"]',
        optional: true,
        asList: false,
        children: null,
      },
    ],
  },
  {
    name: 'addUserFromObject',
    variables: [
      {
        accessChain: ['UserInput'],
        endedFromCycle: false,
        scalarName: 'UserInput',
        name: 'user',
        tsType: 'UserInput',
        optional: false,
        asList: false,
        children: [
          {
            accessChain: ['UserInput', 'Int'],
            endedFromCycle: false,
            scalarName: 'Int',
            name: 'id',
            tsType: 'Scalars["Int"]',
            optional: true,
            asList: false,
            children: null,
          },
          {
            accessChain: ['UserInput', 'String'],
            endedFromCycle: false,
            scalarName: 'String',
            name: 'name',
            tsType: 'Scalars["String"]',
            optional: true,
            asList: false,
            children: null,
          },
          {
            accessChain: ['UserInput', 'String'],
            endedFromCycle: false,
            scalarName: 'String',
            name: 'email',
            tsType: 'Scalars["String"]',
            optional: true,
            asList: false,
            children: null,
          },
          {
            accessChain: ['UserInput', 'String'],
            endedFromCycle: false,
            scalarName: 'String',
            name: 'password',
            tsType: 'Scalars["String"]',
            optional: true,
            asList: false,
            children: null,
          },
          {
            accessChain: ['UserInput', 'UserInput'],
            endedFromCycle: true,
            scalarName: 'UserInput',
            name: 'mother',
            tsType: 'UserInput',
            optional: true,
            asList: false,
            children: null,
          },
          {
            accessChain: ['UserInput', 'UserInput'],
            endedFromCycle: true,
            scalarName: 'UserInput',
            name: 'father',
            tsType: 'UserInput',
            optional: true,
            asList: false,
            children: null,
          },
          {
            accessChain: ['UserInput', 'UserInput'],
            endedFromCycle: true,
            scalarName: 'UserInput',
            name: 'friends',
            tsType: 'UserInput',
            optional: false,
            asList: true,
            children: null,
          },
          {
            accessChain: ['UserInput', 'UserInput'],
            endedFromCycle: true,
            scalarName: 'UserInput',
            name: 'followers',
            tsType: 'UserInput',
            optional: true,
            asList: false,
            children: null,
          },
        ],
      },
    ],
  },
  {
    name: 'addUsers',
    variables: [
      {
        accessChain: [],
        endedFromCycle: false,
        scalarName: 'UserInput',
        name: 'users',
        tsType: 'UserInput',
        optional: false,
        asList: true,
        children: [
          {
            accessChain: ['UserInput'],
            endedFromCycle: false,
            scalarName: 'UserInput',
            name: 'users',
            tsType: 'UserInput',
            optional: true,
            asList: false,
            children: [
              {
                accessChain: ['UserInput', 'Int'],
                endedFromCycle: false,
                scalarName: 'Int',
                name: 'id',
                tsType: 'Scalars["Int"]',
                optional: true,
                asList: false,
                children: null,
              },
              {
                accessChain: ['UserInput', 'String'],
                endedFromCycle: false,
                scalarName: 'String',
                name: 'name',
                tsType: 'Scalars["String"]',
                optional: true,
                asList: false,
                children: null,
              },
              {
                accessChain: ['UserInput', 'String'],
                endedFromCycle: false,
                scalarName: 'String',
                name: 'email',
                tsType: 'Scalars["String"]',
                optional: true,
                asList: false,
                children: null,
              },
              {
                accessChain: ['UserInput', 'String'],
                endedFromCycle: false,
                scalarName: 'String',
                name: 'password',
                tsType: 'Scalars["String"]',
                optional: true,
                asList: false,
                children: null,
              },
              {
                accessChain: ['UserInput', 'UserInput'],
                endedFromCycle: true,
                scalarName: 'UserInput',
                name: 'mother',
                tsType: 'UserInput',
                optional: true,
                asList: false,
                children: null,
              },
              {
                accessChain: ['UserInput', 'UserInput'],
                endedFromCycle: true,
                scalarName: 'UserInput',
                name: 'father',
                tsType: 'UserInput',
                optional: true,
                asList: false,
                children: null,
              },
              {
                accessChain: ['UserInput', 'UserInput'],
                endedFromCycle: true,
                scalarName: 'UserInput',
                name: 'friends',
                tsType: 'UserInput',
                optional: false,
                asList: true,
                children: null,
              },
              {
                accessChain: ['UserInput', 'UserInput'],
                endedFromCycle: true,
                scalarName: 'UserInput',
                name: 'followers',
                tsType: 'UserInput',
                optional: true,
                asList: false,
                children: null,
              },
            ],
          },
        ],
      },
    ],
  },
];
