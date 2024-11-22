const GetReply = require('../GetReply');

describe('GetReply entities', () => {
  it('should create GetReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'a reply',
      username: 'John Doe',
      date: '2021-08-08T07:19:09.775Z',
      commentId: 'comment-123',
    };

    // Action
    const getReply = new GetReply(payload);

    // Assert
    expect(getReply.id).toEqual(payload.id);
    expect(getReply.content).toEqual(payload.content);
    expect(getReply.username).toEqual(payload.username);
    expect(getReply.date).toEqual(payload.date);
    expect(getReply.commentId).toEqual(payload.commentId);
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'a reply',
      username: 'John Doe',
    };

    // Action and Assert
    expect(() => new GetReply(payload)).toThrowError('GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'a reply',
      username: 'John Doe',
      date: '2021-08-08T07:19:09.775Z',
      commentId: 123,
    };

    // Action and Assert
    expect(() => new GetReply(payload)).toThrowError('GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
