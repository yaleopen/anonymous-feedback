module.exports = {
  feedbackPool: {
    user: process.env.DB_FEEDBACK_USER,
    password: process.env.DB_FEEDBACK_PASSWORD,
    database: process.env.DB_FEEDBACK_DATABASE,
    host: process.env.DB_FEEDBACK_HOST,
    max: parseInt(process.env.DB_FEEDBACK_POOL_MAX),
  },
};
