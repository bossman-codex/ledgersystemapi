const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');
const connect = require('../../../db/index');

describe('Post transaction', () => {
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

  it('deposit', (done) => {
    request(app)
      .post('/Transaction/deposit')
      .send({ accountnumber: '644406', name: 'peter', amount: '3000' })
      .then((deposit) => {
        expect(deposit.body).to.equal('Deposit Successful');
        done();
      })
      .catch((err) => done(err));
  });

  it('withdraw', (done) => {
    request(app)
      .post('/Transaction/withdrawal')
      .send({ accountnumber: '644406', name: 'peter', amount: '3000' })
      .then((deposit) => {
        expect(deposit.body).to.equal('Withdrawal Successful');
        done();
      })
      .catch((err) => done(err));
  });
});
