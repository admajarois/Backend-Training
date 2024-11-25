const DeletedComment = require('../DeletedComment');

describe('DeletedComment', () => {
  it('should create DeletedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'This is a deleted comment',
      active: false,
    };

    // Action
    const deletedComment = new DeletedComment(payload);

    // Assert
    expect(deletedComment.id).toEqual(payload.id);
    expect(deletedComment.content).toEqual(payload.content);
    expect(deletedComment.active).toEqual(payload.active);
  });

  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'This is a deleted comment',
    };

    // Action and Assert
    expect(() => new DeletedComment(payload)).toThrowError('DELETED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'This is a deleted comment',
      active: 'false',
    };

    // Action and Assert
    expect(() => new DeletedComment(payload)).toThrowError('DELETED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
