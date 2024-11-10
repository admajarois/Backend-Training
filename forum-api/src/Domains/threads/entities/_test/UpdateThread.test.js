const UpdateThread = require('../UpdateThread');

describe('a UpdateThread entities', () => {

  it('should throw error when title or body is empty', () => {
    const payloadWithEmptyTitle = {
      title: '',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    };

    const payloadWithEmptyBody = {
      title: 'Lorem ipsum dolor sit amet',
      body: '',
    };

    expect(() => new UpdateThread(payloadWithEmptyTitle)).toThrowError('tidak dapat memperbarui thread');
    expect(() => new UpdateThread(payloadWithEmptyBody)).toThrowError('tidak dapat memperbarui thread');
  });

  it('should create updateThread object correctly when id, title, and body are valid', () => {
    const payload = {
      id: 'thread-123',
      title: 'Lorem ipsum dolor sit amet',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
      owner: 'user-123',
    };

    const updateThread = new UpdateThread(payload);

    expect(updateThread).toBeInstanceOf(UpdateThread);
    expect(updateThread.id).toEqual(payload.id);
    expect(updateThread.title).toEqual(payload.title);
    expect(updateThread.body).toEqual(payload.body);
    expect(updateThread.owner).toEqual(payload.owner);
  });
});
