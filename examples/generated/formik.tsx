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
export const defaultUserInput = {
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
  value: Scalars['Int'];
}
export const IntFormInput = (props: IntFormInputPropTypes) => {
  let [shouldRender, setShouldRender] = React.useState(false);
  const { value = 0 } = props;
  return <div>edit id {JSON.stringify(props)}</div>;
};

export interface StringFormInputPropTypes {
  optional: boolean;
  value: Scalars['String'];
}
export const StringFormInput = (props: StringFormInputPropTypes) => {
  let [shouldRender, setShouldRender] = React.useState(false);
  const { value = '' } = props;
  return <div>edit name {JSON.stringify(props)}</div>;
};

export interface UserInputFormInputPropTypes {
  optional: boolean;
  value: UserInput;
}
export const UserInputFormInput = (props: UserInputFormInputPropTypes) => {
  let [shouldRender, setShouldRender] = React.useState(false);
  const { value = defaultUserInput } = props;

  if (props.optional) {
    return (
      <div>
        users<button>Add UserInput</button>
      </div>
    );
  }
  return (
    <div>
      <h4>users with children</h4>
      <IntFormInput optional={true} value={value.id} />
      <StringFormInput optional={true} value={value.name} />
      <StringFormInput optional={true} value={value.email} />
      <UserInputFormInput optional={true} value={value.mother} />
      <UserInputFormInput optional={true} value={value.father} />
      <UserInputFormInputAsList optional={true} value={value.friends} />
    </div>
  );
};

export interface UserInputFormInputAsListPropTypes {
  optional: boolean;
  value: UserInput[];
}
export const UserInputFormInputAsList = (
  props: UserInputFormInputAsListPropTypes
) => {
  const { value: initialValue = [] } = props;
  const [value, setValue] = React.useState(initialValue);
  const addItem = () => setValue((old) => [...old]);
  return (
    <>
      <h3>UserInput as list</h3>

      <div>
        {value.length > 0 ? (
          value.map((item, index) => (
            <div key={index}>
              <UserInputFormInput optional={true} value={item} />

              <button
                type="button"
                onClick={() => console.log('add at index')} // remove a friend from the list
              >
                -
              </button>

              <button
                type="button"
                onClick={() => console.log('insert at ' + index)} // insert an empty string at a position
              >
                +
              </button>
            </div>
          ))
        ) : (
          <button type="button" onClick={() => console.log('add new')}>
            +
          </button>
        )}
      </div>
    </>
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
      <UserInputFormInputAsList optional={false} value={initialValues.users} />
    </form>
  );
};
