import { Spinner } from '@instructure/ui-spinner';
import { Flex } from '@instructure/ui-flex';

const Loading = ({ variant }) =>
  variant === 'small' ? (
    <Spinner renderTitle="Loading" size="small" margin="small" />
  ) : (
    <Flex justifyItems="center" margin="0 0 large">
      <Flex.Item>
        <Spinner renderTitle="Loading" size="large" margin="0 0 0 medium" />
      </Flex.Item>
    </Flex>
  );

export default Loading;
