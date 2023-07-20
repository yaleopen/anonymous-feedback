import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type CreateFeedback = {
  courseId?: InputMaybe<Scalars['String']>;
  courseName?: InputMaybe<Scalars['String']>;
  /** isRead is stored as a 1 or 0 bit, (an Int) but functions as a boolean */
  isRead?: InputMaybe<Scalars['Int']>;
  message?: InputMaybe<Scalars['String']>;
  subaccountName?: InputMaybe<Scalars['String']>;
  termCode?: InputMaybe<Scalars['String']>;
};

export type Feedback = {
  __typename?: 'Feedback';
  courseId?: Maybe<Scalars['String']>;
  courseName?: Maybe<Scalars['String']>;
  dateCreated?: Maybe<Scalars['DateTime']>;
  id: Scalars['Int'];
  /** isRead is stored as a 1 or 0 bit, (an Int) but functions as a boolean */
  isRead?: Maybe<Scalars['Int']>;
  message?: Maybe<Scalars['String']>;
  subaccountName?: Maybe<Scalars['String']>;
  termCode?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  insertFeedback: MutationResponse;
  setReadStatus: MutationResponse;
};


export type MutationInsertFeedbackArgs = {
  feedback?: InputMaybe<CreateFeedback>;
};


export type MutationSetReadStatusArgs = {
  idList?: InputMaybe<Array<Scalars['Int']>>;
};

export type MutationResponse = {
  __typename?: 'MutationResponse';
  /** Human-readable message for the UI */
  message: Scalars['String'];
  /** Indicates whether the update was successful */
  success: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  courseFeedback: Array<Maybe<Feedback>>;
  testQuery?: Maybe<Scalars['Int']>;
};

export type InsertFeedbackMutationVariables = Exact<{
  insertFeedbackFeedback?: InputMaybe<CreateFeedback>;
}>;


export type InsertFeedbackMutation = { __typename?: 'Mutation', insertFeedback: { __typename?: 'MutationResponse', success: boolean, message: string } };

export type SetReadStatusMutationMutationVariables = Exact<{
  idList?: InputMaybe<Array<Scalars['Int']> | Scalars['Int']>;
}>;


export type SetReadStatusMutationMutation = { __typename?: 'Mutation', setReadStatus: { __typename?: 'MutationResponse', success: boolean, message: string } };

export type CourseFeedbackQueryVariables = Exact<{ [key: string]: never; }>;


export type CourseFeedbackQuery = { __typename?: 'Query', courseFeedback: Array<{ __typename?: 'Feedback', id: number, courseName?: string | null | undefined, message?: string | null | undefined, isRead?: number | null | undefined, dateCreated?: any | null | undefined, courseId?: string | null | undefined, subaccountName?: string | null | undefined, termCode?: string | null | undefined } | null | undefined> };


export const InsertFeedbackDocument = gql`
    mutation InsertFeedback($insertFeedbackFeedback: CreateFeedback) {
  insertFeedback(feedback: $insertFeedbackFeedback) {
    success
    message
  }
}
    `;
export type InsertFeedbackMutationFn = Apollo.MutationFunction<InsertFeedbackMutation, InsertFeedbackMutationVariables>;

/**
 * __useInsertFeedbackMutation__
 *
 * To run a mutation, you first call `useInsertFeedbackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertFeedbackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertFeedbackMutation, { data, loading, error }] = useInsertFeedbackMutation({
 *   variables: {
 *      insertFeedbackFeedback: // value for 'insertFeedbackFeedback'
 *   },
 * });
 */
export function useInsertFeedbackMutation(baseOptions?: Apollo.MutationHookOptions<InsertFeedbackMutation, InsertFeedbackMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertFeedbackMutation, InsertFeedbackMutationVariables>(InsertFeedbackDocument, options);
      }
export type InsertFeedbackMutationHookResult = ReturnType<typeof useInsertFeedbackMutation>;
export type InsertFeedbackMutationResult = Apollo.MutationResult<InsertFeedbackMutation>;
export type InsertFeedbackMutationOptions = Apollo.BaseMutationOptions<InsertFeedbackMutation, InsertFeedbackMutationVariables>;
export const SetReadStatusMutationDocument = gql`
    mutation SetReadStatusMutation($idList: [Int!]) {
  setReadStatus(idList: $idList) {
    success
    message
  }
}
    `;
export type SetReadStatusMutationMutationFn = Apollo.MutationFunction<SetReadStatusMutationMutation, SetReadStatusMutationMutationVariables>;

/**
 * __useSetReadStatusMutationMutation__
 *
 * To run a mutation, you first call `useSetReadStatusMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetReadStatusMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setReadStatusMutationMutation, { data, loading, error }] = useSetReadStatusMutationMutation({
 *   variables: {
 *      idList: // value for 'idList'
 *   },
 * });
 */
export function useSetReadStatusMutationMutation(baseOptions?: Apollo.MutationHookOptions<SetReadStatusMutationMutation, SetReadStatusMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetReadStatusMutationMutation, SetReadStatusMutationMutationVariables>(SetReadStatusMutationDocument, options);
      }
export type SetReadStatusMutationMutationHookResult = ReturnType<typeof useSetReadStatusMutationMutation>;
export type SetReadStatusMutationMutationResult = Apollo.MutationResult<SetReadStatusMutationMutation>;
export type SetReadStatusMutationMutationOptions = Apollo.BaseMutationOptions<SetReadStatusMutationMutation, SetReadStatusMutationMutationVariables>;
export const CourseFeedbackDocument = gql`
    query CourseFeedback {
  courseFeedback {
    id
    courseName
    message
    isRead
    dateCreated
    courseId
    subaccountName
    termCode
  }
}
    `;

/**
 * __useCourseFeedbackQuery__
 *
 * To run a query within a React component, call `useCourseFeedbackQuery` and pass it any options that fit your needs.
 * When your component renders, `useCourseFeedbackQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCourseFeedbackQuery({
 *   variables: {
 *   },
 * });
 */
export function useCourseFeedbackQuery(baseOptions?: Apollo.QueryHookOptions<CourseFeedbackQuery, CourseFeedbackQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CourseFeedbackQuery, CourseFeedbackQueryVariables>(CourseFeedbackDocument, options);
      }
export function useCourseFeedbackLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CourseFeedbackQuery, CourseFeedbackQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CourseFeedbackQuery, CourseFeedbackQueryVariables>(CourseFeedbackDocument, options);
        }
export type CourseFeedbackQueryHookResult = ReturnType<typeof useCourseFeedbackQuery>;
export type CourseFeedbackLazyQueryHookResult = ReturnType<typeof useCourseFeedbackLazyQuery>;
export type CourseFeedbackQueryResult = Apollo.QueryResult<CourseFeedbackQuery, CourseFeedbackQueryVariables>;