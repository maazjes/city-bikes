describe('Add journeys view', () => {
  beforeEach(() => {
    cy.request('http://localhost:8080/api/tests/start');
    cy.visit('http://localhost:3000/login');
    cy.get('#username').type('testtest', { force: true });
    cy.get('#password').type('testtest', { force: true });
    cy.get('#login-button').click({ force: true });
    cy.wait(1000);
  });

  afterEach(() => {
    cy.request('http://localhost:8080/api/tests/end');
  });

  it('single journey form adds a new journey', () => {
    cy.visit('http://localhost:3000/add-journeys');
    cy.get('#departureTime').type('2011-10-05T14:48:00.000Z', { force: true });
    cy.get('#returnTime').type('2011-10-05T14:48:00.000Z', { force: true });
    cy.get('#departureStationId').type('-1', { force: true });
    cy.get('#returnStationId').type('-1', { force: true });
    cy.get('#distance').type('20', { force: true });
    cy.get('#duration').type('20', { force: true });
    cy.get('#add-journey').click({ force: true });
    cy.visit('http://localhost:3000/journeys');
    cy.get('#\\:r6\\:').select('departureStationId', { force: true });
    cy.get('#\\:rb\\:').type('-1', { force: true });
    cy.contains('10/5/2011');
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
    cy.wait(2000);
    cy.visit('http://localhost:3000/journeys');
    cy.get('#\\:r6\\:').select('departureStationId', { force: true });
    cy.get('#\\:rb\\:').type('-1', { force: true });
    cy.contains('8,888');
  });
});
