import sanityClient from '@sanity/client';
import * as firebase from 'firebase';

console.log(process.env.NODE_ENV);

const firebaseConfig = {
  apiKey: Cypress.env('NX_FIREBASE_API_KEY'),
  authDomain: Cypress.env('NX_FIREBASE_AUTH_DOMAIN'),
  databaseURL: Cypress.env('NX_FIREBASE_DATABASE_URL'),
  projectId: Cypress.env('NX_FIREBASE_PROJECT_ID'),
  storageBucket: Cypress.env('NX_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: Cypress.env('NX_FIREBASE_MESSAGING_SENDER_ID'),
  appId: Cypress.env('NX_FIREBASE_APP_ID'),
  measurementId: Cypress.env('NX_FIREBASE_MEASUREMENT_ID'),
};

const sanityConfig = {
  projectId: Cypress.env('NX_SANITY_COURSES_PROJECT_ID'),
  dataset: Cypress.env('NX_SANITY_COURSES_DATASET'),
  useCdn: true,
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
db.settings({ host: 'localhost:8080', ssl: false });

export const setCourseData = (data) => {
  db.collection('users')
    .doc(getCurrentUser().uid)
    .collection('courses')
    .doc(TEST_COURSE.slug)
    .set(data);
};

const client = sanityClient(sanityConfig);

export const getCurrentUser = () => firebase.auth().currentUser;

export const getCourseContent = async (course) => {
  const query = `*[_type == "course" && slug.current == "${course}" && visible == true] {
    ...,
    "slug": slug.current,
    visual {
      "default": default.asset -> url,
      "full": full.asset -> url
    },
    learnFrom[] -> {
      ...,
      "image": image.asset -> url
    },
    lessons[] -> {
      _id,
      title,
      description,
      concepts[] -> {
        _id,
        title,
        "type": content[0]._type
      }
    }
  }[0]`;
  const result = await client.fetch(query);
  return result;
};

/* Constants */
const COURSE_TITLE = 'Privacy & Society';
const COURSE_SLUG = 'privacy-and-society';

const TEST_USER_01 = {
  email: 'ada.lovelace@openmined.org',
  password: 'adalovesalace',
  first_name: 'Ada',
  last_name: 'Lovelace',
};

const TEST_USER_02 = {
  email: 'alan.turing@openmined.org',
  password: 'turingmachine',
  first_name: 'Alan',
  last_name: 'Turing',
};

const ALERT_MSG = {
  SIGNIN_SUCCESS: {
    title: 'Sign in successful',
    desc: 'Welcome back!',
  },
  LOGOUT_SUCCESS: {
    title: 'Sign out successful',
    desc: 'Come back soon!',
  },
  SIGNUP_SUCCESS: {
    title: 'Sign up successful',
    desc: 'Welcome to OpenMined Courses!',
  },
  INVALID_PASSWORD: {
    title: 'Error',
    desc: 'The password is invalid or the user does not have a password.',
  },
  INVALID_MAIL: {
    title: 'Error',
    desc:
      'There is no user record corresponding to this identifier. The user may have been deleted.',
  },
  MULTIPLE_IDENTITIES: {
    title: 'Error',
    desc: 'User can only be linked to one identity for the given provider.',
  },
  ACCOUNT_UPDATED: {
    title: 'Account updated',
    desc: 'We have successfully changed your account information.',
  },
  ACCOUNT_DELETED: {
    title: 'Account deleted',
    desc: 'We hate to see you go but wish you all the best!',
  },
  PASSWORD_CHANGED: {
    title: 'Password changed',
    desc: 'We have successfully changed your password.',
  },
  EMAIL_UPDATED: {
    title: 'Email address updated',
    desc: 'We have successfully updated your email address.',
  },
  MAIL_VERIFICATION: {
    title: 'Email verification sent',
    desc: 'We have sent you an email to verify your account.',
  },
  RESET_PASSWORD: {
    title: 'Password reset successful',
    desc: 'Password reset issued, check ',
  },
};

const TEST_COURSE = {
  title: 'Privacy and Society',
  slug: 'privacy-and-society',
};

const TEST_PROGRESS = {
  NOT_STARTED: {},
  CONCEPT_1_STARTED: {
    started_at: true,
    lessons: {
      '8337874c-20c4-4856-95e3-dcbb4a043b63': {
        started_at: true,
        concepts: {
          '215e9c6-8c51-4e56-8f1c-c062c2fee5e6': {
            started_at: true,
          },
        },
      },
    },
  },
  CONCEPT_2_STARTED: {
    started_at: true,
    lessons: {
      '8337874c-20c4-4856-95e3-dcbb4a043b63': {
        started_at: true,
        concepts: {
          '215e9c6-8c51-4e56-8f1c-c062c2fee5e6': {
            started_at: true,
            completed_at: true,
          },
          '5efb1f64-13d6-453f-bc94-b07970ddb370': {
            started_at: true,
          },
        },
      },
    },
  },
  LESSON_1_COMPLETED: {
    started_at: true,
    completed_at: true,
    lessons: {
      '8337874c-20c4-4856-95e3-dcbb4a043b63': {
        started_at: true,
        completed_at: true,
        concepts: {
          '215e9c6-8c51-4e56-8f1c-c062c2fee5e6': {
            started_at: true,
            completed_at: true,
          },
          '5efb1f64-13d6-453f-bc94-b07970ddb370': {
            started_at: true,
            completed_at: true,
          },
        },
      },
      '1f34d3a8-2fa1-4a1e-9ef1-eaaf9dddd617': {
        started_at: true,
        // concepts: {
        //   ''
        // }
      },
    },
  },
};

export {
  COURSE_SLUG,
  COURSE_TITLE,
  TEST_USER_01,
  TEST_USER_02,
  ALERT_MSG,
  TEST_COURSE,
  TEST_PROGRESS,
};
