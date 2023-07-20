const { ForbiddenError } = require('apollo-server-express');
const FeedbackAPI = require('../datasources/anonymous-feedback.js');

const Mutation = {
  async insertFeedback(_, { feedback }, ctx) {
    const { user } = ctx.req;
    if (!user) throw new ForbiddenError('Unauthorized');
    try {
      const feedbackResponse = await FeedbackAPI.insertFeedback(feedback);
      if (feedbackResponse.name === 'error') {
        throw new Error(feedbackResponse.detail);
      }
      return {
        success: true,
        message: `Feedback Submitted`,
      };
    } catch (err) {
      return {
        success: false,
        message: `Error submitting feedback. Please try again.`,
      };
    }
  },
  async setReadStatus(_, { idList }, ctx) {
    const { user } = ctx.req;
    if (!user) throw new ForbiddenError('Unauthorized');
    try {
      const readResponse = await FeedbackAPI.setRead(idList);
      if (readResponse.name === 'error') {
        throw new Error(readResponse.detail);
      }
      return {
        success: true,
        message: `Read Status Updated`,
      };
    } catch (err) {
      return {
        success: false,
        message: `Error. Please try again. ${err.message}`,
      };
    }
  },
};

module.exports = Mutation;
