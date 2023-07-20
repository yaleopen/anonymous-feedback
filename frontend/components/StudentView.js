import { Alert } from '@instructure/ui-alerts';
import { View } from '@instructure/ui-view';
import { TextArea } from '@instructure/ui-text-area';
import { Pill } from '@instructure/ui-pill';
import { Button } from '@instructure/ui-buttons';
import { Flex } from '@instructure/ui-flex';
import { Spinner } from '@instructure/ui-spinner';
import React, { useEffect, useState } from 'react';
import { useInsertFeedbackMutation } from '../generated/apollo-components.tsx';

export default function StudentView({ session }) {
  const [currentInput, updateCurrentInput] = useState('');
  const [resultOfMutation, updateResultOfMutation] = useState(null);

  // The following const elements are used to display the results of the
  // mutation in the current moment: used in the DecideMutationDisplay function
  // errorAlert appears when the submission fails for whatever reason
  const errorAlert = (
    <Alert
      variant="error"
      renderCloseButtonLabel="Close"
      margin="small"
      liveRegion={() => document.getElementById('bottomLine')}
      liveRegionPoliteness="assertive"
      onDismiss={() => updateResultOfMutation(null)}
      timeout={5000}
    >
      Error submitting feedback. Please try again.
    </Alert>
  );

  // successAlert appears when the submission goes through properly
  const successAlert = (
    <Alert
      variant="success"
      renderCloseButtonLabel="Close"
      margin="small"
      liveRegion={() => document.getElementById('bottomLine')}
      liveRegionPoliteness="assertive"
      onDismiss={() => updateResultOfMutation(null)}
      timeout={5000}
    >
      Feedback Submitted
    </Alert>
  );

  // loadingSpinner happens when the Mutation is still ongoing
  const loadingSpinner = (
    <Spinner renderTitle="Loading" size="small" margin="0 0 0 medium" />
  );

  function DecideMutationDisplay() {
    if (resultOfMutation === 'data') {
      return successAlert;
    }
    if (resultOfMutation === 'loading') {
      return loadingSpinner;
    }
    if (resultOfMutation === 'error') {
      return errorAlert;
    }
    return <></>;
  }

  // Sets up the Mutation to call later
  const [insertFeedbackMutation, { data, loading, error }] =
    useInsertFeedbackMutation();

  // Triggers when the the submit button is pressed: ctually calls the mutation
  const handleSubmit = () => {
    const insertVariables = {
      courseName: session.courseName,
      message: currentInput,
      isRead: 0,
      courseId: session.courseId,
      subaccountName: session.subaccountName,
      termCode: session.termCode,
    };

    insertFeedbackMutation({
      variables: {
        insertFeedbackFeedback: insertVariables,
      },
    }).catch((err) =>
      console.log('Submition of feedback has resulted in an error', err),
    );
  };

  let buttonStatus, pillColor;
  if (currentInput.length > 1000) {
    buttonStatus = 'disabled';
    pillColor = 'danger';
  } else {
    buttonStatus = 'enabled';
    pillColor = 'success';
  }

  const bottomLine = (
    <Flex height="4.375rem">
      <Flex.Item>
        <Button
          color="primary"
          margin="small"
          interaction={buttonStatus}
          onClick={() => handleSubmit()}
        >
          Submit
        </Button>
      </Flex.Item>
      <Flex.Item shouldShrink shouldGrow>
        <DecideMutationDisplay />
      </Flex.Item>
      <Flex.Item>
        <Pill color={pillColor} margin="x-small">
          <div>{1000 - currentInput.length}</div>
        </Pill>
      </Flex.Item>
      {/* React will error out on onChange if the {currentInput} variable is not wrapped in a tag other than the Pill */}
    </Flex>
  );

  // Is responsible for registering when the results of the mutation change
  // and update the state of this (StudentView) component accordingly
  useEffect(() => {
    if (loading) {
      updateResultOfMutation('loading');
    }
    if (error) {
      updateResultOfMutation('error');
    }
    if (data) {
      updateResultOfMutation('data');
      // Extra step: reset the text area to empty
      updateCurrentInput('');
    }
  }, [loading, data, error]);

  return (
    <View id="studentView">
      <TextArea
        label="Your Comment"
        resize="vertical"
        required={true}
        maxHeight="40rem"
        onChange={(e) => updateCurrentInput(e.target.value)}
        id="textSubmission"
        value={currentInput}
      />
      <View role="alert" id="bottomLine">
        {bottomLine}
      </View>
    </View>
  );
}
