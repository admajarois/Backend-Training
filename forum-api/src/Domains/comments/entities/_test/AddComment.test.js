const AddComment = require('../AddComment');

describe('AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'a comment',
      threadId: 'thread-123',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('tidak dapat membuat komentar');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 123,
      thread: 'thread-123',
      owner: {},
      date: false,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('tidak dapat membuat komentar');
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'a comment',
      thread: 'thread-123',
      owner: 'user-123',
      date: new Date(),
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.thread).toEqual(payload.thread);
    expect(addComment.owner).toEqual(payload.owner);
    expect(addComment.date).toEqual(payload.date);
  });
});
