const expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

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

describe('generateLocationMessage', () => {
  it('should generate correct location message object', ()=> {
    var from = 'Admin';
    var lat = 123;
    var long = 324;
    var url = `https://www.google.com/maps?q=${lat},${long}`

    var message = generateLocationMessage(from, lat, long);
    expect(message).toMatchObject({
      from,
      url
    })
    expect(typeof message.createdAt).toBe('number');
  });
});