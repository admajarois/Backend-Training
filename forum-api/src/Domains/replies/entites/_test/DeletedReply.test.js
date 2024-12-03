const DeletedReply = require('../DeletedReply');

describe('DeletedReply entities', () => {
  it('should create DeletedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      active: false,
    };

    // Action
    const deletedReply = new DeletedReply(payload);

    // Assert
    expect(deletedReply.id).toEqual(payload.id);
    expect(deletedReply.content).toEqual('**Balasan telah dihapus**');
    expect(deletedReply.active).toEqual(payload.active);
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      active: false,
    };

    // Action and Assert
    expect(() => new DeletedReply(payload)).toThrowError('DELETED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      active: true,
    };

    // Action and Assert
    expect(() => new DeletedReply(payload)).toThrowError('DELETED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
