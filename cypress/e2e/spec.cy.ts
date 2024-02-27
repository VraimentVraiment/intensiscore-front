describe('Connects to the app', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
  })
})

describe('Can access the survey', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/diagnostic-simple')
  })
})
