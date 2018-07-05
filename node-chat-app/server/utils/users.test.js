const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {

  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'test',
      room: 'test'
    },{
      id: '2',
      name: 'test one',
      room: 'test 1'
    },{
      id: '3',
      name: 'test two',
      room: 'test'
    }]
  })

  it('should add new users', () => {
    var users = new Users();
    var user =  {
      id: '123',
      name: 'chan',
      room: 'myroom'
    }
    var res = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  })

  it('should return names for the test room', () => {
    var userList = users.getUserList('test');
    expect(userList).toEqual(['test', 'test two'])
  })

  it('should return names for the test 1 room', () => {
    var userList = users.getUserList('test 1');
    expect(userList).toEqual(['test one'])
  })

  it('should find user', () => {
    var userId = '2';
    var user = users.getUser(userId);
    expect(user.id).toBe(userId);
  })

  it('should find not user', () => {
    var userId = '2122';
    var user = users.getUser(userId);
    expect(user).toBe(undefined);
  })

  it('should remove user', () => {
    var userId = '2';
    var user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  })

  it('should not remove user', () => {
    var userId = '2122';
    var user = users.removeUser(userId);
    expect(users.users.length).toBe(3);
  })

})

