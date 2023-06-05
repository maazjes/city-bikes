describe('Add stations view', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('#username').type('testtest', { force: true });
    cy.get('#password').type('testtest', { force: true });
    cy.get('#login-button').click({ force: true });
    cy.request('http://localhost:8080/api/tests/start');
  });

  afterEach(() => {
    cy.request('http://localhost:8080/api/tests/end');
  });

  it('single station form adds a new station', () => {
    cy.visit('http://localhost:3000/add-stations');
    cy.get('#id').type('-5', { force: true });
    cy.get('#name').type('test', { force: true });
    cy.get('#address').type('test', { force: true });
    cy.get('#city').type('test', { force: true });
    cy.get('#operator').type('test', { force: true });
    cy.get('#capacity').type('20', { force: true });
    cy.get('#latitude').type('20', { force: true });
    cy.get('#longitude').type('20', { force: true });
    cy.get('#add-station').click({ force: true });
    cy.visit('http://localhost:3000/stations');
    cy.get('#\\:rb\\:').type('-5', { force: true });
    cy.contains('test');
  });

  it('stations file upload adds stations', () => {
    cy.visit('http://localhost:3000/add-stations');
    cy.readFile<string>('stations.csv').then((contents) =>
      cy.get('#select-file').selectFile(
        {
          contents: Cypress.Buffer.from(contents),
          fileName: 'stations.csv',
          mimeType: 'application/csv'
        },
        { force: true }
      )
    );
    cy.get('#upload-file').click({ force: true });
    cy.wait(1000);
    cy.visit('http://localhost:3000/stations');
    cy.get('#\\:rb\\:').type('-3', { force: true });
    cy.contains('test1');
  });
});
