describe('Add journeys view', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('#username').type('testtest', { force: true });
    cy.get('#password').type('testtest', { force: true });
    cy.get('#login-button').click({ force: true });
    cy.request('http://localhost:8080/api/resettests');
    cy.request('POST', 'http://localhost:8080/api/stations', { id: 9999, name: 'test' });
  });

  it('single journey form adds a new journey', () => {
    cy.visit('http://localhost:3000/add-journeys');
    cy.get('#departureTime').type('2011-10-05T14:48:00.000Z', { force: true });
    cy.get('#returnTime').type('2011-10-05T14:48:00.000Z', { force: true });
    cy.get('#departureStationId').type('9999', { force: true });
    cy.get('#returnStationId').type('9999', { force: true });
    cy.get('#distance').type('20', { force: true });
    cy.get('#duration').type('20', { force: true });
    cy.get('#add-journeys-button').click({ force: true });
    cy.visit('http://localhost:3000/journeys');
    cy.get('#\\:r6\\:').select('departureStationId', { force: true });
    cy.get('#\\:rb\\:').type('9999', { force: true });
    cy.contains('2011-10-05T14:48:00.000Z');
  });

  it('journey file upload adds journeys', () => {
    cy.visit('http://localhost:3000/add-journeys');
    cy.readFile<string>('journeys.csv').then((contents) =>
      cy.get('#select-file').selectFile(
        {
          contents: Cypress.Buffer.from(contents),
          fileName: 'journeys.csv',
          mimeType: 'application/csv'
        },
        { force: true }
      )
    );
    cy.get('#upload-file').click({ force: true });
    cy.visit('http://localhost:3000/journeys');
    cy.get('#\\:r6\\:').select('departureStationId', { force: true });
    cy.get('#\\:rb\\:').type('9999', { force: true });
    cy.contains('8,888');
  });
});
