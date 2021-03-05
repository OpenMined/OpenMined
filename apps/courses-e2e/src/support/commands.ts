/* eslint-disable cypress/no-unnecessary-waiting */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  type User = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  };

  type AlertMessage = {
    title: string;
    desc: string;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
    logout(): void;
    createUser(user: User): void;
    deleteAccount(): void;
    checkAlert(message: AlertMessage): void;
    acceptCookies(): void;
    saveLocalStorageCache(): void;
    restoreLocalStorageCache(): void;
    fetchCoursesData(): void;
    goToLesson(course: string, ref: string): void;
    answerQuiz(question: string, answer: string, finish?: boolean): void;
  }
}

/* Constants */
const LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/signin');
  cy.get("input[name='email']").type(email);
  cy.get("input[name='password']").type(password);
  cy.get('form').submit();
  console.log('Logging as', email, password);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000);
});

Cypress.Commands.add('logout', () => {
  cy.get('span.chakra-avatar').first().click();
  cy.contains('p.chakra-text', 'Logout').click();
});

Cypress.Commands.add('createUser', (user) => {
  cy.visit('/signup');
  cy.get("input[name='first_name']").type(user.first_name);
  cy.get("input[name='last_name']").type(user.last_name);
  cy.get("input[name='email']").type(user.email);
  cy.get("input[name='password']").type(user.password);
  cy.get("input[name='password_confirm']").type(user.password);
  cy.get('form').submit();

  const dashboardUrl = '/users/dashboard';
  cy.url({ timeout: 10000 }).should('include', dashboardUrl);
});

Cypress.Commands.add('deleteAccount', () => {
  cy.get('span.chakra-avatar').first().click();
  cy.contains('p.chakra-text', 'Account Settings').click();

  cy.get('button').contains('Manage Account').click();
  cy.get('button').contains('Delete Account').click();
  cy.get('footer.chakra-modal__footer').within(() => {
    cy.get('button').contains('Delete Account').click();
  });
});

Cypress.Commands.add('acceptCookies', () => {
  cy.get('div#cookies').contains('Accept all cookies').click();
  Cypress.Cookies.defaults({
    whitelist: (cookie) => true,
  });
  cy.log('Cookies Accepted!');
});

Cypress.Commands.add('isNotActionable', (element, done) => {
  element.click({ force: true });
  cy.once('fail', (err) => {
    expect(err.message).to.include('cy.click() failed because this element');
    expect(err.message).to.include('is being covered by another element');
    done();
  });
  done(
    new Error('Expected element NOT to be clickable, but click() succeeded')
  );
});

Cypress.Commands.add('saveLocalStorageCache', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorageCache', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

Cypress.Commands.add('answerQuiz', (question, answer, finish = false) => {
  cy.get('p')
    .contains(question)
    .parent('div')
    .within(() => {
      cy.get('div').contains(answer).click();
      cy.get('svg')
        .parent()
        .contains(finish ? 'Finish' : 'Next')
        .click();
    });
});

Cypress.Commands.add('goToLesson', (course, ref) =>
  cy.visit(`/courses/${course}/${ref}`)
);

Cypress.Commands.add('checkAlert', (message) => {
  cy.get('div.chakra-alert__title', { timeout: 5000 })
    .last()
    .should('have.text', message.title);
  cy.get('div.chakra-alert__desc', { timeout: 5000 }).last().should('have.text', message.desc);
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
