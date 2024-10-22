const UpdateThread = require('../UpdateThread');

describe('a UpdateThread entities', () => {
  it('should throw error when id is not found', () => {
    const payload = {
      id: 'unexists-id',
      title: 'Lorem ipsum dolor sit amet',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    };

    expect(() => new UpdateThread(payload)).toThrowError('UPDATE_THREAD.ID_NOT_FOUND');
  });

  it('should throw error when title or body is empty', () => {
    const payloadWithEmptyTitle = {
      id: 'thread-123',
      title: '',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    };

    const payloadWithEmptyBody = {
      id: 'thread-123',
      title: 'Lorem ipsum dolor sit amet',
      body: '',
    };

    expect(() => new UpdateThread(payloadWithEmptyTitle)).toThrowError('UPDATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new UpdateThread(payloadWithEmptyBody)).toThrowError('UPDATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should create updateThread object correctly when id, title, and body are valid', () => {
    const payload = {
      id: 'thread-123',
      title: 'Lorem ipsum dolor sit amet',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    };

    const updateThread = new UpdateThread(payload);

    expect(updateThread).toBeInstanceOf(UpdateThread);
    expect(updateThread.id).toEqual(payload.id);
    expect(updateThread.title).toEqual(payload.title);
    expect(updateThread.body).toEqual(payload.body);
  });
});
