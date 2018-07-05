const expect = require('expect');

var {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non string values', () => {
    var string = 123234234234234;
    var response = isRealString(string);
    expect(response).toBe(false)
  })

  it('should reject string with only spaces', () => {
    var string = '       ';
    var response = isRealString(string);
    expect(response).toBe(false)
  })

  it('should allow string with non spaces characters', () => {
    var string = 'adsfds';
    var response = isRealString(string);
    expect(response).toBe(true)
  })
})