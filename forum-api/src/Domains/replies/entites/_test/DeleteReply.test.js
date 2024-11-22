const DeleteReply = require('../DeleteReply');

describe('DeleteReply entities', () => {
  it('should create DeleteReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'a reply',
      owner: 'user-123',
    };

    // Action
    const deleteReply = new DeleteReply(payload);

    // Assert
    expect(deleteReply.id).toEqual(payload.id);
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'a reply',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'a reply',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
