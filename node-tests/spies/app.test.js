const expect = require('expect');
const rewire = require('rewire');

var app = rewire('./app');
// app.__set__
// app.__get__


describe('App', () => {

  var db = {
    saveUser: expect.createSpy()
  }
  
  app.__set__('db', db);
  
  it('should call spy correctly', () => {
    var spy = expect.createSpy();
    spy('C', 25);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('C', 25);
  });

  it('should call saveUser with user object', () => {
    var email = 'c@a.com'
    var password = 'password'

    app.handleSignup(email, password);
    expect(db.saveUser).toHaveBeenCalledWith({email, password});
  });

});