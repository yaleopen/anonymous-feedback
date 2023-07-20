import PropTypes from 'prop-types';
import { useCourseFeedbackQuery } from '../generated/apollo-components.tsx';
import FeedbackTable from './FeedbackTable';
import Loading from './Loading.js';
import ErrorView from './Error.js';
import { useEffect, useState } from 'react';
import { Flex } from '@instructure/ui-flex';
import { Button } from '@instructure/ui-buttons';
import { TextInput } from '@instructure/ui-text-input';
import { ScreenReaderContent } from '@instructure/ui-a11y-content';
import DownloadFeedbackCSV from './DownloadFeedbackCSV.js';

function InstructorView({ session }) {
  const [filteredRows, updateRowsShown] = useState();
  const [searchBy, updateSearchFilter] = useState('');

  const { data, loading, error } = useCourseFeedbackQuery();

  const handleSearch = (e) => {
    e.preventDefault();
    const searchFor = e.target[0].value;
    updateSearchFilter(searchFor);
  };

  useEffect(() => {
    if (data) {
      // update rowsShown with new data
      const newFilteredList = data.courseFeedback.filter((row) =>
        // eslint-disable-next-line
        row.message.toLowerCase().includes(searchBy.toLowerCase())
      );
      updateRowsShown(newFilteredList);
    }
  }, [loading, data, error, searchBy]);

  let view;

  if (loading) {
    view = <Loading />;
  } else if (error) {
    view = <ErrorView err={error} />;
  } else if (data) {
    if (!filteredRows) {
      updateRowsShown(data.courseFeedback);
    }
    view = (
      <>
        <Flex wrap="wrap">
          <Flex.Item shouldShrink shouldGrow size="200px">
            <DownloadFeedbackCSV
              session={session}
              data={filteredRows}
              searchBy={searchBy}
            />
          </Flex.Item>
          <Flex.Item as="form" onSubmit={handleSearch}>
            <TextInput
              renderLabel={<ScreenReaderContent>Search</ScreenReaderContent>}
              display="inline-block"
              width="12rem"
              margin="small"
            />
            &nbsp;
            <Button margin="small" type="submit">
              Search
            </Button>
          </Flex.Item>
        </Flex>
        <FeedbackTable rows={filteredRows} />
      </>
    );
  }

  return (
    <div>
      <p>{JSON.stringify(error)}</p>
      {view}
    </div>
  );
}

InstructorView.propTypes = {
  courseId: PropTypes.string,
};

export default InstructorView;
