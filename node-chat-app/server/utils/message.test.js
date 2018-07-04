const expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMesssage', () => {
  it('should generate to correct message object', () => {
    var from = 'admin@example.com'
    var text = 'Tis is text'
    var result = generateMessage(from, text)
    expect(result.from).toBe(from);
    expect(result.text).toBe(text);
    expect(result).toMatchObject({
      from,
      text
    })
    expect(typeof result.createdAt).toBe('number');
  })
})