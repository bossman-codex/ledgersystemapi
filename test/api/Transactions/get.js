const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');
const connect = require('../../../db/index');

describe('GET transaction/all', () => {
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

  it('get all transaction', (done) => {
    request(app)
      .get('/Transaction/all')
      .send({ accountnumber: '536783' })
      .then((res) => {
        const body = res.body[0];
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('AccountNumberSender');
        expect(body).to.contain.property('AccountNumberReceiver');
        expect(body).to.contain.property('AccountBalance');
        expect(body).to.contain.property('Amount');
        expect(body).to.contain.property('TransactionId');
        expect(body).to.contain.property('TimeCreated');
        expect(body).to.contain.property('__v');
        done();
      })
      .catch((err) => done(err));
  });
});
