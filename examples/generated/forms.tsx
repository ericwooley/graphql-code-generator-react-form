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
  email: Scalars['String'];
  friends: Array<Maybe<User>>;
};

export type UserInput = {
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  email: Scalars['String'];
  mother?: Maybe<UserInput>;
  father?: Maybe<UserInput>;
  friends: Array<Maybe<UserInput>>;
};

export type AddUserMutationVariables = Exact<{
  email: Scalars['String'];
  name: Scalars['String'];
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

/**********************
 * Default Values
 * *******************/
export const defaultUserInputScalar = {
  get id(): Scalars['Int'] | undefined {
    const val = 0;
    if (val === undefined) return val;
    return JSON.parse(JSON.stringify(val));
  },

  get name(): Scalars['String'] | undefined {
    const val = '';
    if (val === undefined) return val;
    return JSON.parse(JSON.stringify(val));
  },

  get email(): Scalars['String'] | undefined {
    const val = '';
    if (val === undefined) return val;
    return JSON.parse(JSON.stringify(val));
  },

  get mother(): UserInput | undefined {
    const val = undefined;
    if (val === undefined) return val;
    return JSON.parse(JSON.stringify(val));
  },

  get father(): UserInput | undefined {
    const val = undefined;
    if (val === undefined) return val;
    return JSON.parse(JSON.stringify(val));
  },

  get friends(): UserInput[] | undefined {
    const val = undefined;
    if (val === undefined) return val;
    return JSON.parse(JSON.stringify(val));
  },
};

let idNonce = 0;
const uniqueId = (inStr: string) => inStr + idNonce++;
/******************************
 * Scalar Components
 * ****************************/

export interface StringFormInputPropTypes {
  optional: boolean;
  label: string;
  value: Scalars['String'];
  scalarName: string;
  name: string;
  parentPath: string;
  onChange: (value: Scalars['String']) => unknown;
}
export const StringFormInput = React.memo((props: StringFormInputPropTypes) => {
  const { parentPath, label, name, value, onChange } = props;
  const path = [parentPath, name].join('.');
  return (
    <div>
      <label>
        <strong>
          {label} {name} {path}
        </strong>
        <br />
        <input
          value={value === undefined ? '' : value}
          onChange={(e) => onChange(e.target.value as any)}
        />
      </label>
    </div>
  );
});

export interface IntFormInputPropTypes {
  optional: boolean;
  label: string;
  value: Scalars['Int'];
  scalarName: string;
  name: string;
  parentPath: string;
  onChange: (value: Scalars['Int']) => unknown;
}
export const IntFormInput = React.memo((props: IntFormInputPropTypes) => {
  const { parentPath, label, name, value, onChange } = props;
  const path = [parentPath, name].join('.');
  return (
    <div>
      <label>
        <strong>
          {label} {name} {path}
        </strong>
        <br />
        <input
          value={value === undefined ? '' : value}
          onChange={(e) => onChange(e.target.value as any)}
        />
      </label>
    </div>
  );
});

export interface UserInputFormInputPropTypes {
  optional: boolean;
  label: string;
  value: UserInput;
  scalarName: string;
  name: string;
  parentPath: string;
  onChange: (value: UserInput) => unknown;
}
export const UserInputFormInput = React.memo(
  (props: UserInputFormInputPropTypes) => {
    const { parentPath, label, name, value, onChange } = props;
    const path = [parentPath, name].join('.');
    let [shouldRender, setShouldRender] = React.useState(false);

    if (props.optional && !shouldRender) {
      return (
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onChange(JSON.parse(JSON.stringify(defaultUserInputScalar)));
              setShouldRender(true);
            }}
          >
            Add {label}
          </button>
        </div>
      );
    }
    return (
      <div className="mutationFormNested">
        <h4>{label}</h4>
        <IntFormInput
          value={value?.id}
          scalarName={'Int'}
          name={'id'}
          optional={true}
          label={'Id'}
          parentPath={path}
          onChange={(newValue) => onChange({ ...value, ['id']: newValue })}
        />
        <StringFormInput
          value={value?.name}
          scalarName={'String'}
          name={'name'}
          optional={true}
          label={'Name'}
          parentPath={path}
          onChange={(newValue) => onChange({ ...value, ['name']: newValue })}
        />
        <StringFormInput
          value={value?.email}
          scalarName={'String'}
          name={'email'}
          optional={true}
          label={'Email'}
          parentPath={path}
          onChange={(newValue) => onChange({ ...value, ['email']: newValue })}
        />
        <UserInputFormInput
          value={value?.mother}
          scalarName={'UserInput'}
          name={'mother'}
          optional={true}
          label={'Mother'}
          parentPath={path}
          onChange={(newValue) => onChange({ ...value, ['mother']: newValue })}
        />
        <UserInputFormInput
          value={value?.father}
          scalarName={'UserInput'}
          name={'father'}
          optional={true}
          label={'Father'}
          parentPath={path}
          onChange={(newValue) => onChange({ ...value, ['father']: newValue })}
        />
        <UserInputFormInputAsList
          value={value?.friends}
          scalarName={'UserInput'}
          name={'friends'}
          optional={true}
          label={'Friends'}
          parentPath={path}
          onChange={(newValue) => onChange({ ...value, ['friends']: newValue })}
        />
      </div>
    );
  }
);

export interface UserInputFormInputAsListPropTypes {
  optional: boolean;
  label: string;
  value: UserInput[];
  scalarName: string;
  name: string;
  parentPath: string;
  onChange: (value: UserInput[]) => unknown;
}
export const UserInputFormInputAsList = React.memo(
  (props: UserInputFormInputAsListPropTypes) => {
    const { parentPath, label, name, value, onChange } = props;
    const path = [parentPath, name].join('.');
    const valueMapRef = React.useRef<{ id: string; value: UserInput }[]>(
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
      onChange(valueMapRef.current.map((i) => i.value));
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
      onChange(valueMapRef.current.map((i) => i.value));
    };
    const removeItem = (index: number) => {
      valueMapRef.current = [
        ...valueMapRef.current.slice(0, index),
        ...valueMapRef.current.slice(index + 1),
      ];
      onChange(valueMapRef.current.map((i) => i.value));
    };
    return (
      <div className="mutationFormNested mutationFormList">
        {label && (
          <h3>
            {label} {path}
          </h3>
        )}
        <ol>
          {valueMapRef.current.length > 0 ? (
            valueMapRef.current.map((item, index) => (
              <li key={item.id}>
                <UserInputFormInput
                  optional={false}
                  label={''}
                  value={item.value}
                  scalarName={'UserInput'}
                  name={String(index)}
                  parentPath={path}
                  onChange={(newValue) => {
                    valueMapRef.current = valueMapRef.current.map((i) =>
                      i.id === item.id ? { id: item.id, value: newValue } : i
                    );
                    onChange(valueMapRef.current.map((i) => i.value));
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)} // remove a friend from the list
                >
                  -
                </button>

                <button
                  type="button"
                  onClick={() => insertItem(index)} // insert an empty string at a position
                >
                  +
                </button>
              </li>
            ))
          ) : (
            <button type="button" onClick={addItem}>
              +
            </button>
          )}
        </ol>
      </div>
    );
  }
);

/****************************
 * forms Forms
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
        defaultVal: '""',
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
        defaultVal: '""',
        optional: false,
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
        defaultVal: '"undefined"',
        optional: false,
        asList: false,
        children: [
          {
            accessChain: ['UserInput', 'Int'],
            endedFromCycle: false,
            scalarName: 'Int',
            name: 'id',
            tsType: 'Scalars["Int"]',
            defaultVal: '0',
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
            defaultVal: '""',
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
            defaultVal: '""',
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
            defaultVal: '"undefined"',
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
            defaultVal: '"undefined"',
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
            defaultVal: '"undefined"',
            optional: true,
            asList: true,
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
        name: 'users',
        optional: false,
        children: [
          {
            accessChain: ['UserInput'],
            endedFromCycle: false,
            scalarName: 'UserInput',
            name: 'users',
            tsType: 'UserInput',
            defaultVal: '"undefined"',
            optional: true,
            asList: false,
            children: [
              {
                accessChain: ['UserInput', 'Int'],
                endedFromCycle: false,
                scalarName: 'Int',
                name: 'id',
                tsType: 'Scalars["Int"]',
                defaultVal: '0',
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
                defaultVal: '""',
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
                defaultVal: '""',
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
                defaultVal: '"undefined"',
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
                defaultVal: '"undefined"',
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
                defaultVal: '"undefined"',
                optional: true,
                asList: true,
                children: null,
              },
            ],
          },
        ],
        tsType: 'UserInput',
        defaultVal: '[]',
        scalarName: 'UserInput',
        asList: true,
      },
    ],
  },
];

export const addUserDefaultValues = {
  email: '',
  name: '',
};

export interface AddUserFormVariables {
  email: Scalars['String'];
  name: Scalars['String'];
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
  onSubmit: (values: AddUserFormVariables) => unknown;
}) => {
  const [value, setValue] = React.useState(initialValues || {});
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value as any);
      }}
      {...formProps}
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
      <input type="submit" value="submit" />
    </form>
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
  onSubmit: (values: AddUserFromObjectFormVariables) => unknown;
}) => {
  const [value, setValue] = React.useState(initialValues || {});
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value as any);
      }}
      {...formProps}
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
      <input type="submit" value="submit" />
    </form>
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
  onSubmit: (values: AddUsersFormVariables) => unknown;
}) => {
  const [value, setValue] = React.useState(initialValues || {});
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value as any);
      }}
      {...formProps}
    >
      <UserInputFormInputAsList
        value={value?.users}
        label={'Users'}
        parentPath={'root'}
        onChange={(value) => {
          console.log('onChange users', value);
          setValue((oldVal) => ({ ...oldVal, ['users']: value }));
        }}
        name={'users'}
        optional={false}
        scalarName={'UserInput'}
      />
      <input type="submit" value="submit" />
    </form>
  );
};
