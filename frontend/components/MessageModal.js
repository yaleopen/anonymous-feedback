import { Modal } from '@instructure/ui-modal';
import { Button, CloseButton } from '@instructure/ui-buttons';
import { Text } from '@instructure/ui-text';
import { TruncateText } from '@instructure/ui-truncate-text';
import { Link } from '@instructure/ui-link';
import React, { useState } from 'react';
import { View } from '@instructure/ui-view';

export default function MessageModal({ message, layout, markAsRead }) {
  const [isOpen, setOpenStatus] = useState(false);
  function openModal() {
    setOpenStatus(true);
    markAsRead();
  }
  function closeModal() {
    setOpenStatus(false);
  }

  const renderLink = () =>
    layout === 'stacked' ? (
      message
    ) : (
      <TruncateText maxLines={1}>{message}</TruncateText>
    );

  return (
    <View>
      <Link isWithinText={false} onClick={openModal}>
        {renderLink()}
      </Link>

      <Modal
        open={isOpen}
        label="Full Message Text"
        size="large"
        onDismiss={closeModal}
        shouldCloseOnDocumentClick
      >
        <Modal.Header>
          <CloseButton
            placement="end"
            offset="small"
            onClick={closeModal}
            screenReaderLabel="Close"
          />
        </Modal.Header>
        <Modal.Body>
          <Text>{message}</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal} margin="0 x-small 0 0">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </View>
  );
}
