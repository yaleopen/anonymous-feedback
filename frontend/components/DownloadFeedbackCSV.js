import { CSVLink } from 'react-csv';
import { Button } from '@instructure/ui-buttons';
import { IconDownloadLine } from '@instructure/ui-icons';

function ReadableDateTime(dateTime) {
  const dateCreated = new Date(dateTime);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const dateTimeString =
    dateCreated.toLocaleDateString('en-US', options) +
    ', ' +
    dateCreated.toLocaleTimeString('en-us', {
      hour: '2-digit',
      minute: '2-digit',
    });
  return dateTimeString;
}

function DownloadFeedbackCSV({ session, data, searchBy }) {
  const readableData = data.map((row) => ({
    message: row.message,
    dateCreated: ReadableDateTime(row.dateCreated),
  }));

  const headers = [
    {
      label: 'Date Posted',
      key: 'dateCreated',
    },
    {
      label: 'Comment',
      key: 'message',
    },
  ];

  let fileName = session.courseName + '-';
  if (searchBy) fileName = fileName + searchBy + '-';
  fileName = fileName + 'anon-feedback.csv';

  return (
    <CSVLink
      uFEFF={false}
      data={readableData}
      headers={headers}
      filename={fileName}
    >
      <Button renderIcon={IconDownloadLine} margin="none x-small none none">
        Download CSV
      </Button>
    </CSVLink>
  );
}

export default DownloadFeedbackCSV;
module.exports.ReadableDateTime = ReadableDateTime;
