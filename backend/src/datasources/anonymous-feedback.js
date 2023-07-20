const debug = require('debug')('app:datasources:feedback');
const database = require('../services/database.js');

const feedbackQuery = `
SELECT * FROM feedback
WHERE course_id = $1
ORDER BY id ASC `;

const insertFeedbackQuery = `
INSERT into "feedback" ("course_name", "message", "is_read", "course_id", "subaccount_name", "term_code") VALUES
	($1, $2, $3, $4, $5, $6);`;

const updateReadQuery = `UPDATE feedback SET is_read=B'1' where id = ANY ($1)`;

const getCoursesInTermWithUnreadQuery = `
SELECT DISTINCT course_id, course_name, term_code
FROM feedback
WHERE is_read=B'0' and term_code=$1`;

const getCoursesWithNewUnreadQuery = `
SELECT DISTINCT course_id, course_name, term_code
FROM feedback
WHERE is_read=B'0' and term_code=$1 and now()-date_created < interval '1 day'
`;

async function getFeedbackForCourse(courseId) {
  const binds = [courseId];

  const feedbackQueryResults = await database.simpleExecute(
    feedbackQuery,
    binds
  );
  debug(`Querying on course ${courseId} found result:`);
  const mappedresults = feedbackQueryResults.rows.map((row) => ({
    id: row.id,
    courseName: row.course_name,
    message: row.message,
    isRead: row.is_read,
    dateCreated: row.date_created,
    courseId: row.course_id,
    subaccountName: row.subaccount_name,
    termCode: row.term_code,
  }));
  debug(mappedresults);
  return mappedresults;
}

async function insertFeedback(feedback) {
  const binds = Object.values(feedback);
  const insertFeedbackResults = await database.simpleExecute(
    insertFeedbackQuery,
    binds
  );
  debug(`Inserting ${JSON.stringify(feedback)} found result:`);
  debug(JSON.stringify(insertFeedbackResults));
  return insertFeedbackResults;
}

async function setRead(feedbackIdList) {
  const binds = [feedbackIdList];
  const setReadResults = await database.simpleExecute(updateReadQuery, binds);
  debug(`Setting read status of ${binds} with results:`);
  debug(JSON.stringify(setReadResults));
  return setReadResults;
}

function addUnreadToMap(row, mapObject) {
  mapObject.set(row.course_id, {
    courseName: row.course_name,
  });
}

async function getCoursesWithUnread(termName, mode) {
  const binds = [termName];
  let queryString;
  if (mode === 'all') {
    queryString = getCoursesInTermWithUnreadQuery;
  } else if (mode === 'daily') {
    queryString = getCoursesWithNewUnreadQuery;
  } else {
    return null;
  }
  const unreadCoursesResults = await database.simpleExecute(queryString, binds);
  const mappedresults = new Map();
  unreadCoursesResults.rows.forEach((row) =>
    addUnreadToMap(row, mappedresults)
  );
  debug(`${mode} unread for ${binds} with results:`);
  debug(mappedresults);
  return mappedresults;
}

module.exports.getFeedbackForCourse = getFeedbackForCourse;
module.exports.insertFeedback = insertFeedback;
module.exports.setRead = setRead;
module.exports.getCoursesWithUnread = getCoursesWithUnread;
