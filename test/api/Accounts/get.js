const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');
const connect = require('../../../db/index');

describe('GET /Account/balance', () => {
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

  it('Get Account Balance', (done) => {
    request(app)
      .get('/Account/balance')
      .send({ accountNumber: '772557' })
      .then((res) => {
        const body = res.body;

        expect(body.Message).to.equal('Your Current Balance is 0.00');

        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, if accountnumber is missing', (done) => {
    request(app)
      .get('/Account/balance')
      .send({})
      .then((res1) => {
        const body1 = res1.body;
        expect(body1.message).to.equal('AccountNumber MISSING!!');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, if account number is wrong', (done) => {
    request(app)
      .get('/Account/balance')
      .send({ accountNumber: '900990' })
      .then((res2) => {
        const body2 = res2.body;
        expect(body2.message).to.equal('Invalid Account Number');
        done();
      })
      .catch((err) => done(err));
  });
});
