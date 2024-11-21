const DetailComment = require('../DetailComment');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

describe('DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Comment Content',
      username: undefined,
      date: new Date().toString(),
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'Comment Content',
      username: 'testuser',
      date: 123,
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Comment Content',
      username: 'testuser',
      date: new Date().toString(),
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toEqual(payload);
  });
});
