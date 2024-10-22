const DeleteThread = require('../DeleteThread');

describe('a DeleteThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new DeleteThread(payload)).toThrowError('DELETE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 123,
    };

    expect(() => new DeleteThread(payload)).toThrowError('DELETE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create deleteThread object correctly', () => {
    const payload = {
      threadId: 'thread-123',
    };

    const deleteThread = new DeleteThread(payload);

    expect(deleteThread).toBeInstanceOf(DeleteThread);
    expect(deleteThread.threadId).toEqual(payload.threadId);
  });
});
