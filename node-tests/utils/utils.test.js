const expect = require('expect');
const utils = require('./utils');


describe('Utils', () => {

  // it('should add two numbers', () => {
  //   var res = utils.add(33, 11);
  //   if(res !== 44) {
  //     throw new Error(`Expected 44, but got ${res}`);
  //   }
  // });


  it('should add two numbers', () => {
    var res = utils.add(33, 11);
    expect(res).toBe(44).toBeA('number');
  });

  it('should asyncAdd two numbers', (done) => {
    utils.asyncAdd(4,3, (sum) => {
      expect(sum).toBe(7).toBeA('number');
      done();
    })
  });

  it('should square a number', () => {
    var res = utils.square(4);
    expect(res).toBe(16).toBeA('number');
  });

  it('should asyncSquare a number', (done) => {
    utils.asyncSquare(12, (square) => {
      expect(square).toBe(144).toBeA('number');
      done();
    });
  });

  it('should set first and last name', () => {
    var user = {
      age: 21,
      location: 'NY'
    };
    var fullName = 'Chanakya Devraj';
    var res = utils.setName(user, fullName);
    expect(res).toEqual(user); //Not neccesary
    expect(res).toInclude({
      firstName: 'Chanakya',
      lastName: 'Devraj'
    })
    expect(res).toBeA('object');
  });
});
  