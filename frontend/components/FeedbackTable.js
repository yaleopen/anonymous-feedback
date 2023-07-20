import React, { useState } from 'react';
import { Table } from '@instructure/ui-table';
import { Alert } from '@instructure/ui-alerts';
import { Responsive } from '@instructure/ui-responsive';
import { Checkbox } from '@instructure/ui-checkbox';
import { Pagination } from '@instructure/ui-pagination';
import { View } from '@instructure/ui-view';
import { ScreenReaderContent } from '@instructure/ui-a11y-content';
import { Flex } from '@instructure/ui-flex';
import { Button } from '@instructure/ui-buttons';
import MessageModal from './MessageModal.js';
import Loading from './Loading.js';
import { ReadableDateTime } from './DownloadFeedbackCSV';
import {
  useSetReadStatusMutationMutation,
  CourseFeedbackDocument,
} from '../generated/apollo-components.tsx';
import { Text } from '@instructure/ui-text';

function SelectableTable(tableProps) {
  const { caption, headers, rows, onSort, sortBy, ascending, rowIds } =
    tableProps;
  const [selected, updateSelected] = useState(new Set());

  const allSelected =
    selected.size > 0 && rowIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0 && !allSelected;
  const direction = ascending ? 'ascending' : 'descending';

  const handleSelectAll = () => {
    updateSelected(allSelected ? new Set() : new Set(rowIds));
  };

  const handleSelectRow = (rowSelected, rowId) => {
    const copy = new Set(selected);
    if (rowSelected) {
      copy.delete(rowId);
    } else {
      copy.add(rowId);
    }

    updateSelected(copy);
  };

  const [setReadStatusMutation, { loading: setReadStatusLoading, error }] =
    useSetReadStatusMutationMutation();

  const handleMarkAsRead = (singleRowId, isRead) => {
    if (selected.size > 0 || (singleRowId && !isRead)) {
      const priority = singleRowId ? new Set([singleRowId]) : selected;
      setReadStatusMutation({
        variables: {
          idList: [...priority],
        },
        refetchQueries: [CourseFeedbackDocument],
        awaitRefetchQueries: true,
      });

      if (!error) {
        if (!singleRowId) updateSelected(new Set());
      } else {
        throw new Error('Something went wrong, please try again');
      }
    }
  };

  return (
    <Responsive
      query={{
        small: { maxWidth: '40rem' },
        large: { minWidth: '41rem' },
      }}
      props={{
        small: { layout: 'stacked' },
        large: { layout: 'fixed' },
      }}
    >
      {(props) => (
        <div>
          <View as="div" padding="small" background="primary-inverse">
            {`${selected.size} of ${rowIds.length} selected`}
          </View>
          <Table
            hover="true"
            caption={`${caption}: sorted by ${sortBy} in ${direction} order`}
            {...props}
          >
            <Table.Head
              renderSortLabel={
                <ScreenReaderContent>Sort by</ScreenReaderContent>
              }
            >
              <Table.Row>
                <Table.ColHeader id="select">
                  <Checkbox
                    label={
                      <ScreenReaderContent>Select all</ScreenReaderContent>
                    }
                    onChange={() => handleSelectAll(allSelected)}
                    checked={allSelected}
                    indeterminate={someSelected}
                  />
                </Table.ColHeader>
                {(headers || []).map(({ id, text, width }) => (
                  <Table.ColHeader
                    key={id}
                    id={id}
                    width={width}
                    onRequestSort={onSort}
                    stackedSortByLabel={text}
                    sortDirection={id === sortBy ? direction : 'none'}
                  >
                    {text}
                  </Table.ColHeader>
                ))}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {(rows || []).map((row) => {
                const rowSelected = selected.has(row.id);
                const alt = row.isRead === 1 ? { background: '#ebebeb' } : {};
                return (
                  <Table.Row key={row.id}>
                    <Table.RowHeader themeOverride={alt}>
                      <Checkbox
                        label={
                          <ScreenReaderContent>Select row</ScreenReaderContent>
                        }
                        onChange={() => handleSelectRow(rowSelected, row.id)}
                        checked={rowSelected || row.isRead === 1}
                        disabled={row.isRead === 1}
                      />
                    </Table.RowHeader>
                    {(headers || []).map(({ id, renderCell }) => (
                      <Table.Cell key={id} themeOverride={alt}>
                        {
                          /* eslint-disable */
                          renderCell
                            ? renderCell(row[id], props.layout, () => handleMarkAsRead(row.id, row.isRead))
                          : row[id]
                          /* eslint-enable */
                        }
                      </Table.Cell>
                    ))}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          {setReadStatusLoading ? (
            <Loading variant="small" />
          ) : (
            <Button
              color="primary"
              margin="small"
              onClick={() => handleMarkAsRead()}
            >
              Mark Selected as Read
            </Button>
          )}
          <Alert
            liveRegion={() => document.getElementById('flash-messages')}
            liveRegionPoliteness="polite"
            screenReaderOnly
          >
            {`${selected.size} of ${rowIds.length} selected`}
          </Alert>
        </div>
      )}
    </Responsive>
  );
}

class PaginatedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rows: props.rows,
    };
  }

  handleClick = (page) => {
    this.setState({
      page,
    });
  };

  handleSort = (event, options) => {
    const { onSort } = this.props;

    this.setState({
      page: 0,
    });
    onSort(event, options);
  };

  render() {
    const { caption, headers, sortBy, ascending, perPage, rows } = this.props;
    const { page } = this.state;
    const startIndex = page * perPage;
    const slicedRows = rows.slice(startIndex, startIndex + perPage);
    const pageCount = perPage && Math.ceil(rows.length / perPage);

    return (
      <div>
        <SelectableTable
          caption={caption}
          headers={headers}
          rows={slicedRows}
          onSort={this.handleSort}
          sortBy={sortBy}
          ascending={ascending}
          rowIds={rows.map((row) => row.id)}
        />
        <Flex>
          <Flex.Item shouldShrink shouldGrow>
            {rows.length > 0 ? (
              <p>
                Showing {startIndex + 1} to {startIndex + slicedRows.length} of{' '}
                {rows.length} entries
              </p>
            ) : (
              <p> No entries found </p>
            )}
          </Flex.Item>
          {pageCount > 1 && (
            <Flex.Item>
              <Pagination
                variant="compact"
                labelNext="Next Page"
                labelPrev="Previous Page"
                margin="small"
              >
                {Array.from(Array(pageCount), (item, index) => (
                  <Pagination.Page
                    key={index}
                    onClick={() => this.handleClick(index)}
                    current={index === page}
                  >
                    {index + 1}
                  </Pagination.Page>
                ))}
              </Pagination>
            </Flex.Item>
          )}
        </Flex>

        <Alert
          liveRegion={() => document.getElementById('flash-messages')}
          liveRegionPoliteness="polite"
          screenReaderOnly
        >
          {`Table page ${page + 1} of ${pageCount}`}
        </Alert>
      </div>
    );
  }
}

class SortableTable extends React.Component {
  constructor(props) {
    super(props);
    const { headers } = props;

    // Default state is to sort in descending order of dateCreated (newest to oldest)
    this.state = {
      sortBy: headers && headers[2] && headers[2].id,
      ascending: false,
    };
  }

  handleSort = (event, { id }) => {
    const { sortBy, ascending } = this.state;
    if (id === sortBy) {
      this.setState({
        ascending: !ascending,
      });
    } else {
      this.setState({
        sortBy: id,
        ascending: true,
      });
    }
  };

  render() {
    const { caption, headers, perPage, rows } = this.props;
    const { sortBy, ascending } = this.state;
    const sortedRows = [...rows].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return -1;
      }
      if (a[sortBy] > b[sortBy]) {
        return 1;
      }
      return 0;
    });

    if (!ascending) {
      sortedRows.reverse();
    }
    return (
      <div>
        <PaginatedTable
          caption={caption}
          headers={headers}
          rows={sortedRows}
          onSort={this.handleSort}
          sortBy={sortBy}
          ascending={ascending}
          perPage={perPage}
        />
        <Alert
          liveRegion={() => document.getElementById('flash-messages')}
          liveRegionPoliteness="polite"
          screenReaderOnly
        >
          {`Sorted by ${sortBy} in ${
            ascending ? 'ascending' : 'descending'
          } order`}
        </Alert>
      </div>
    );
  }
}

const renderReadStatus = (isRead) => {
  let readStatus = 'Unread';
  if (isRead === 1) {
    readStatus = 'Read';
  }
  return <Text>{readStatus}</Text>;
};

const renderDateTime = (dateTime) => <Text>{ReadableDateTime(dateTime)}</Text>;

const renderTextAndModal = (message, layout, updateReadStatus) => (
  <MessageModal
    message={message}
    layout={layout}
    markAsRead={updateReadStatus}
  />
);

const FeedbackTable = ({ rows }) => (
  <SortableTable
    caption="Student Feedback"
    headers={[
      {
        id: 'message',
        text: 'Comment',
        width: '60%',
        renderCell: renderTextAndModal,
      },
      {
        id: 'isRead',
        text: 'Status',
        width: '10%',
        renderCell: renderReadStatus,
      },
      {
        id: 'dateCreated',
        text: 'Date Posted',
        width: '20%',
        renderCell: renderDateTime,
      },
    ]}
    rows={rows}
    perPage={10}
  />
);

export default FeedbackTable;
