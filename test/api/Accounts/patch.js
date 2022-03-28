const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');
const connect = require('../../../db/index');

describe('PATCH', () => {
  before((done) => {
    connect
      .connected()
      .then(() => done())
      .catch((err) => done(err));
  });

  after((done) => {
    connect
      .closeconnection()
      .then(() => done())
      .catch((err) => done(err));
  });

  it('OK, Update account', (done) => {
    request(app)
      .patch('/Account/update')
      .send({ accountNumber: '644406', name: 'peter' })
      .then((update) => {
        const updated = update.body;
        expect(updated.message).to.equal('Account Updated');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, if account number is missing for updating account', (done) => {
    request(app)
      .patch('/Account/update')
      .send({ name: 'peter' })
      .then((update1) => {
        const updated1 = update1.body;
        expect(updated1.message).to.equal('AccountNumber MISSING!!');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, if account number is wrong for updating account', (done) => {
    request(app)
      .patch('/Account/update')
      .send({ accountNumber: '899088', name: 'peter' })
      .then((update2) => {
        const updated2 = update2.body;
        expect(updated2.message).to.equal('Account not found');
        done();
      })
      .catch((err) => done(err));
  });

  // Disable route

  it('OK, deactivating an account works', (done) => {
    request(app)
      .patch('/Account/disable')
      .send({ accountNumber: '344586' })
      .then((disable) => {
        const disabled = disable.body;
        expect(disabled.message).to.equal('Account Disabled');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, if account number is missing for deactivating an account', (done) => {
    request(app)
      .patch('/Account/disable')
      .send({})
      .then((disable1) => {
        const disabled1 = disable1.body;
        expect(disabled1.message).to.equal('AccountNumber MISSING!!');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, if account number is wrong deactivating an account', (done) => {
    request(app)
      .patch('/Account/disable')
      .send({ accountNumber: '899088' })
      .then((disable2) => {
        const disabled2 = disable2.body;
        expect(disabled2.message).to.equal('Account not found');
        done();
      })
      .catch((err) => done(err));
  });
  // Activate route
  it('OK, activating an account works', (done) => {
    request(app)
      .patch('/Account/activate')
      .send({ accountNumber: '590318' })
      .then((active1) => {
        const activated = active1.body;
        expect(activated.message).to.equal('Account Activated');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, if account number is missing to activate', (done) => {
    request(app)
      .patch('/Account/activate')
      .send({})
      .then((res1) => {
        const body1 = res1.body;

        expect(body1.message).to.equal('AccountNumber Is MISSING!!');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, if account number is wrong for activation', (done) => {
    request(app)
      .patch('/Account/activate')
      .send({ accountNumber: '899088' })
      .then((res1) => {
        const body1 = res1.body;
        expect(body1.message).to.equal('Account not found');
        done();
      })
      .catch((err) => done(err));
  });
});
