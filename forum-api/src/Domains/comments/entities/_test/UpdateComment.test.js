const UpdateComment = require('../UpdateComment');

describe('UpdateComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'updated content',
    };

    // Action and Assert
    expect(() => new UpdateComment(payload)).toThrowError('UPDATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'updated content',
    };

    // Action and Assert
    expect(() => new UpdateComment(payload)).toThrowError('UPDATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create UpdateComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'updated content',
    };

    // Action
    const updateComment = new UpdateComment(payload);

    // Assert
    expect(updateComment.id).toEqual(payload.id);
    expect(updateComment.content).toEqual(payload.content);
  });
});
