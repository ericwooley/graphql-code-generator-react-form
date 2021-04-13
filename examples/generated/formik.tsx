import * as React from 'react';
import { Formik, Form, FormikConfig } from 'formik';
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

/****************************
 * Formik Forms
 * *************************/

export const addUsersDefaultValues = {
  users: undefined,
};

export interface AddUsersFormVariables {
  users: UserInput[];
}
export const AddUsersForm = ({
  initialValues,
  onSubmit,
  ...formikProps
}: FormikConfig<AddUsersFormVariables>) => {
  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{ ...addUsersDefaultValues, ...initialValues }}
      {...formikProps}
    >
      <Form>
        <div>
          <h4>users</h4>
          <label>
            <h5>users.id</h5>
            <input name="users.id" type="Scalars.Int" />
          </label>
          <label>
            <h5>users.name</h5>
            <input name="users.name" type="Scalars.String" />
          </label>
          <label>
            <h5>users.email</h5>
            <input name="users.email" type="Scalars.String" />
          </label>
          <label>
            <h5>users.mother</h5>
            <input name="users.mother" type="UserInput" />
          </label>
          <label>
            <h5>users.father</h5>
            <input name="users.father" type="UserInput" />
          </label>
          <label>
            <h5>users.friends</h5>
            <input name="users.friends" type="UserInput" />
          </label>
        </div>
      </Form>
    </Formik>
  );
};
