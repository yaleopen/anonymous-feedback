const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs').promises;
const debug = require('debug')('app:services:emailReminderAPI');

const { apiPassport } = require('../auth/apiPassport.js');
const FeedbackAPI = require('../../datasources/anonymous-feedback.js');
const CanvasAPI = require('../../datasources/canvas.js');

const emailAPI = async function (req, res, next) {
  // This link showed me how to use a REST Datasource outside of apollo:
  // https://thomasstep.com/blog/using-apollo-datasources-outside-of-apollo
  const canvasAPIClient = new CanvasAPI();
  canvasAPIClient.initialize({});

  // Step 0) Check that mode and termCode are defined
  const { termCode, mode } = req.query;
  if (!termCode || !mode) {
    res.status(400).send(`mode and termCode are required parameters`);
    return;
  }

  // Step 1) Find all courses with unread feedback in DB
  // coursesUnread Gets populated with a map of courseIds to courseNames
  let coursesWithUnread;
  if (mode === 'all' || mode === 'daily') {
    const termName = await canvasAPIClient.getTermName(termCode);
    coursesWithUnread = await FeedbackAPI.getCoursesWithUnread(termName, mode);
  } else {
    res.status(400).send(`${mode} is an invalid mode`);
    return;
  }

  const emailInfo = new Map();

  for await (const course of coursesWithUnread.entries()) {
    // Step 2) Grab external tool Id for each course's instance of the Feedback App and store it in the map
    // This is for the purpose of creating a link that the instructor can click on the go directly
    // to the Feedback tool for the course they've been informed about
    const courseId = course[0];
    const courseDetails = course[1];
    const toolId = await canvasAPIClient.getExternalToolID(courseId);
    if (toolId == null) {
      debug(
        `Tool info about course ${courseId} not found: emails for this course will not be sent`
      );
      coursesWithUnread.delete(courseId);
    } else {
      coursesWithUnread.set(courseId, { ...courseDetails, toolId });

      // Step 3) Find all instructors (emails) for each of the above courses and create
      // a map for each to store email details and courses in
      const instructorEmails =
        await canvasAPIClient.getInstructorEmailsForCourse(courseId);

      // Step 4) Compile courseids for unreadCourses that each teacher needs to be informed about
      instructorEmails.forEach((emailAddress) => {
        if (!emailInfo.has(emailAddress)) {
          emailInfo.set(emailAddress, []);
        }
        emailInfo.get(emailAddress).push(courseId);
      });
    }
  }
  // At this point, emailInfo contains a mapping of instructor email
  // addresses to courseIds for which they need to be notified about
  // And coursesWithUnread is a mapping of courseIds to JSON objects
  // with thecorresponding courseName and externalToolId

  // Step 5) Create and Send email with pertinant info
  // Step 5a) Setting up nodemailer transport
  const transportConfig = {
    pool: true,
    host: process.env.MAIL_HOST,
  };
  const transporter = nodemailer.createTransport(transportConfig);

  // Step 5b) Setting up ejs/templating for the email HTML
  const templateHTMLString = await fs.readFile(
    `${__dirname}/emailTemplate.ejs`,
    {
      encoding: 'utf8',
      flag: 'r',
    }
  );
  const feedbackURLTemplate = `${process.env.API_CANVAS_URL}/courses/:courseId/external_tools/:feedbackId`;

  emailInfo.forEach((courseList, instructorEmail) => {
    // Step 5c) for each instructor, collect the proper data for each
    // course needed to be listed in the email from coursesWithUnread
    const emailCourseData = [];
    let plaintext = `Hi there,\n'
      ${
        mode === 'daily'
          ? 'New feedback has been posted within the past day for the below courses:\n'
          : 'You have unread feedback for the following courses:\n'
      }`;
    courseList.forEach((courseId) => {
      const { courseName } = coursesWithUnread.get(courseId);
      const feedbackURL = feedbackURLTemplate
        .replace(':courseId', courseId)
        .replace(':feedbackId', String(coursesWithUnread.get(courseId).toolId));
      emailCourseData.push({
        courseId,
        courseName,
        feedbackURL,
      });
      plaintext += `${courseName}: ${feedbackURL} \n`;
    });
    const emailHTML = ejs.render(templateHTMLString, {
      emailCourseData,
      isDaily: mode === 'daily',
    });

    // Step 5d) Set up message content and send it
    const message = {
      from: process.env.MAIL_FROM,
      to: instructorEmail,
      subject: 'New Anonymous Feedback',
      text: plaintext,
      html: emailHTML,
    };
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        debug(
          `Email sent to email=${instructorEmail} courseIds=${courseList.join()}: ${
            info.response
          }`
        );
      }
    });
  });
  res.status(200).send('Emailing complete');
};

module.exports = (app) => {
  app.get(
    '/feedback/emailReminder',
    apiPassport.authenticate('basic', { session: false }),
    emailAPI
  );
};
