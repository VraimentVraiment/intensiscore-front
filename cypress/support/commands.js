// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Cookies.debug(true)

Cypress.session.clearAllSavedSessions()

Cypress.Commands.add('login', () => {
  cy.session('login', () => {
    cy.visit('http://localhost:3000/auth')
    cy.get('form input[name="email"]').type('admin@gps.fr')
    cy.get('form input[name="password"]').type('password')
    cy.get('form button[name="login"').click()
    cy.url().should('match', /\/$/)
  })
})
