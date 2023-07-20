import gql from 'graphql-tag';

export default gql`
  mutation InsertFeedback($insertFeedbackFeedback: CreateFeedback) {
    insertFeedback(feedback: $insertFeedbackFeedback) {
      success
      message
    }
  }
`;
