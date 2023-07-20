import gql from 'graphql-tag';

export default gql`
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
