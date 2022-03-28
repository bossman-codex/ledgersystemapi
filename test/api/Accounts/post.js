const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');
const connect = require('../../../db/index');

describe('POST /Account/create', () => {
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

  it('OK, creating a new account works', (done) => {
    request(app)
      .post('/Account/create')
      .send({ email: 'wo01@gmail.com', name: 'peter' })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('AccountNumber');
        expect(body).to.contain.property('AccountBalance');
        expect(body).to.contain.property('AccountStatus');
        expect(body).to.contain.property('Name');
        expect(body).to.contain.property('EmailAddress');
        expect(body).to.contain.property('TimeCreated');
        expect(body).to.contain.property('__v');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, if email or name is missing', (done) => {
    request(app)
      .post('/Account/Create')
      .send({ name: 'paul' })
      .then((res1) => {
        const body1 = res1.body;
        console.log(body1);
        expect(body1.message).to.equal('Email or Name is MISSING!!');
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, if email already exist', (done) => {
    request(app)
      .post('/Account/Create')
      .send({ email: 'war@gmail.com', name: 'peter' })
      .then((res2) => {
        const body2 = res2.body;
        console.log(body2);
        expect(body2.message).to.equal(
          'Email Already In Use , TRY ANOTHER EMAIL ADDRESS'
        );
        done();
      })
      .catch((err) => done(err));
  });
});
