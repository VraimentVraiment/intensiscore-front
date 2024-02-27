// https://docs.cypress.io/guides/guides/plugins-guide.html

// For component testing 1/2
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { startDevServer } = require('@cypress/vite-dev-server')

module.exports = (on, config) => {
  // For component testing 2/2
  on('dev-server:start', options => startDevServer({ options }))

  return Object.assign({}, config, {
    fixturesFolder: 'cypress/fixtures',
    integrationFolder: 'cypress/specs',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    supportFile: 'cypress/support/index.js',
  })
}
