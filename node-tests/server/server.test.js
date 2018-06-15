const request = require('supertest');
const expect = require('expect');


var app = require('./server').app;

describe('Server', () => {
  it('should return hello world response', (done) => {
    request(app)
    .get('/')
    .expect(404)
    .expect((res) => {
      expect(res.body).toInclude({
        error: 'page not found',
        name: 'TodoApp v1.0'
      });
    })
    .end(done);
  });
});