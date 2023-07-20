import * as React from 'react';
import Layout from '../components/main-layout';
import StudentView from '../components/StudentView';
import InstructorView from '../components/InstructorView';
import ErrorView from '../components/Error';
import { withIronSessionSsr } from 'iron-session/next';
import { fetchSession } from '../lib/session';

export default function Index({ user }) {
  let view, message;

  const roleList = user ? user.roles : [];
  if (
    roleList.includes('StudentEnrollment') ||
    roleList.includes('Guest Student') ||
    roleList.includes('Visitor') ||
    roleList.includes('Auditor')
  ) {
    view = <StudentView session={user} />;
    message = (
      <p>
        {' '}
        Please use this form to anonymously share any feedback or to describe
        any accessibility barriers you have to the instructor of this course.
        <br />
        <br />
        In reporting accessibility barriers, it is useful if you are as detailed
        as possible (e.g., the course activity, assignment, or file and how it
        is inaccessible, as well as any other identifying information). This
        information will be provided to the course instructor anonymously, so
        it's important to be thorough.
      </p>
    );
  } else if (roleList.includes('Instructor')) {
    view = <InstructorView session={user} />;
    message = (
      <p>
        This form is available to your students to anonymously share course
        feedback or to describe an accessibility barrier they may have with
        content in your course.
      </p>
    );
  } else {
    view = <ErrorView />;
  }

  return (
    <Layout title="Anonymous Feedback" messageText={message}>
      {view}
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    return {
      props: {
        user: req.session.user || null,
      },
    };
  },
  async () => {
    const sessionResponse = await fetchSession();
    return sessionResponse.sessionOptions;
  },
);
