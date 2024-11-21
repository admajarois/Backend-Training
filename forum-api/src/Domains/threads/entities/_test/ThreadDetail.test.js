const DetailThread = require('../DetailThread');


describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      thread: {
        id: 324,
        title: undefined,
        body: undefined,
        username: undefined,
        date: undefined,
      },
    };

    expect(() => new DetailThread(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      thread: {
        id: 324,
        title: {},
        body: 1243,
        username: [],
        date: 123,
      },
    };

    expect(() => new DetailThread(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailThread object correctly', () => {
    const payload = {
      thread: { 
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        username: 'testuser',
        date: expect.any(String),
      },
    };

    const detailThread = new DetailThread(payload);

    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread.id).toEqual(payload.thread.id);
    expect(detailThread.title).toEqual(payload.thread.title);
    expect(detailThread.body).toEqual(payload.thread.body);
    expect(detailThread.username).toEqual(payload.thread.username);
    expect(detailThread.date).toEqual(payload.thread.date);
  });
});
