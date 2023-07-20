import { Alert } from '@instructure/ui-alerts';
import PropTypes from 'prop-types';

function ErrorView({ err }) {
  let message =
    'Due to your enrollment, you do not have access to this tool. If you think this is an error, please contact your instructor.';
  if (err) {
    message = `GraphQL encountered an error. ${JSON.stringify(err)}`;
  }

  console.log('Client recieved error:', message);
  return (
    <Alert
      variant="error"
      margin="small"
      liveRegion={() => document.getElementById('flash-messages')}
      liveRegionPoliteness="assertive"
    >
      {message}
    </Alert>
  );
}

ErrorView.propTypes = {
  err: PropTypes.object,
};

export default ErrorView;
