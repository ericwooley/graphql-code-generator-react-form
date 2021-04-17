import * as React from 'react';
import { Formik, Form, FormikConfig, FieldArray } from 'formik';
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
};

export type MutationRootAddUsersArgs = {
  users: Array<Maybe<UserInput>>;
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
  id: Scalars['Int'];
  name: Scalars['String'];
  email: Scalars['String'];
  mother?: Maybe<UserInput>;
  father?: Maybe<UserInput>;
  friends: Array<Maybe<UserInput>>;
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
    return 0;
  },

  get name(): Scalars['String'] | undefined {
    return '';
  },

  get email(): Scalars['String'] | undefined {
    return '';
  },

  get mother(): UserInput | undefined {
    return undefined;
  },

  get father(): UserInput | undefined {
    return undefined;
  },

  get friends(): UserInput[] | undefined {
    return undefined;
  },
};

/******************************
 * Scalar Components
 * ****************************/

export interface IntFormInputPropTypes {
  optional: boolean;
  label: string;
  value: Scalars['Int'];
  scalarName: string;
  name: string;
}
export const IntFormInput = (props: IntFormInputPropTypes) => {
  let [shouldRender, setShouldRender] = React.useState(false);
  const { label, value: initialValue = 0 } = props;
  const [value, setValue] = React.useState(initialValue);
  return (
    <div>
      <strong>{label}</strong>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
};

export interface StringFormInputPropTypes {
  optional: boolean;
  label: string;
  value: Scalars['String'];
  scalarName: string;
  name: string;
}
export const StringFormInput = (props: StringFormInputPropTypes) => {
  let [shouldRender, setShouldRender] = React.useState(false);
  const { label, value: initialValue = '' } = props;
  const [value, setValue] = React.useState(initialValue);
  return (
    <div>
      <strong>{label}</strong>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
};

export interface UserInputFormInputPropTypes {
  optional: boolean;
  label: string;
  value: UserInput;
  scalarName: string;
  name: string;
}
export const UserInputFormInput = (props: UserInputFormInputPropTypes) => {
  let [shouldRender, setShouldRender] = React.useState(false);
  const { label, value: initialValue = defaultUserInputScalar } = props;
  const [value, setValue] = React.useState(initialValue);

  if (props.optional && !shouldRender) {
    return (
      <div>
        {label}{' '}
        <button
          onClick={(e) => {
            e.preventDefault();
            setShouldRender(true);
          }}
        >
          Add UserInput
        </button>
      </div>
    );
  }
  return (
    <div className="mutationFormNested">
      <h4>{label}</h4>
      <IntFormInput
        value={value.id}
        scalarName={'Int'}
        name={'id'}
        optional={true}
        label={'Id'}
      />
      <StringFormInput
        value={value.name}
        scalarName={'String'}
        name={'name'}
        optional={true}
        label={'Name'}
      />
      <StringFormInput
        value={value.email}
        scalarName={'String'}
        name={'email'}
        optional={true}
        label={'Email'}
      />
      <UserInputFormInput
        value={value.mother}
        scalarName={'UserInput'}
        name={'mother'}
        optional={true}
        label={'Mother'}
      />
      <UserInputFormInput
        value={value.father}
        scalarName={'UserInput'}
        name={'father'}
        optional={true}
        label={'Father'}
      />
      <UserInputFormInputAsList
        value={value.friends}
        scalarName={'UserInput'}
        name={'friends'}
        optional={true}
        label={'Friends'}
      />
    </div>
  );
};

export interface UserInputFormInputAsListPropTypes {
  optional: boolean;
  label: string;
  value: UserInput[];
  scalarName: string;
  name: string;
}
export const UserInputFormInputAsList = (
  props: UserInputFormInputAsListPropTypes
) => {
  let [shouldRender, setShouldRender] = React.useState(false);
  const { label, value: initialValue = [] } = props;
  const [value, setValue] = React.useState(initialValue);
  const addItem = () => setValue((old) => [...old, defaultUserInputScalar]);
  const insertItem = (index: number) =>
    setValue((old) => [
      ...old.slice(0, index),
      defaultUserInputScalar,
      ...old.slice(index),
    ]);
  const removeItem = (index: number) =>
    setValue((old) => [
      ...old.slice(0, index),
      defaultUserInputScalar,
      ...old.slice(index + 1),
    ]);
  return (
    <div className="mutationFormNested mutationFormList">
      <h3>{label}</h3>
      <ol>
        {value.length > 0 ? (
          value.map((item, index) => (
            <div key={index}>
              <li>
                <UserInputFormInput
                  optional={false}
                  label={'Users'}
                  value={item}
                  scalarName={'UserInput'}
                  name={'users'}
                />
              </li>

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
            </div>
          ))
        ) : (
          <button type="button" onClick={addItem}>
            Add {label}
          </button>
        )}
      </ol>
    </div>
  );
};

/****************************
 * Formik Forms
 * *************************/
export const mutationsMetaData = [
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
        tsType: 'UserInput[]',
        defaultVal: '[]',
        scalarName: 'UserInput',
        asList: true,
      },
    ],
  },
];

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
> & { initialValues?: AddUsersFormVariables }) => {
  return (
    <form onSubmit={onSubmit} {...formProps}>
      <UserInputFormInputAsList
        value={initialValues.users}
        label={'Users'}
        name={'users'}
        optional={false}
        scalarName={'UserInput'}
      />
    </form>
  );
};
