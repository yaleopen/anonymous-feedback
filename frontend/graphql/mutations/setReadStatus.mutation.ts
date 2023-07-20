import gql from 'graphql-tag';

export default gql`
  mutation SetReadStatusMutation($idList: [Int!]) {
    setReadStatus(idList: $idList) {
      success
      message
    }
  }
`;
