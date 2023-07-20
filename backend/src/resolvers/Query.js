const FeedbackAPI = require('../datasources/anonymous-feedback.js');

const Query = {
  testQuery() {
    return 1;
  },
  courseFeedback(_, __, ctx) {
    const { user } = ctx.req;
    if (!user || !user.roles.includes('Instructor')) return [];
    return FeedbackAPI.getFeedbackForCourse(user.courseId);
  },
};

module.exports = Query;
