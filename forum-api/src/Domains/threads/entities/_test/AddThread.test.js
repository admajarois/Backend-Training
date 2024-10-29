const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: false,
      body: false,
      owner: false,
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 123,
      body: {},
      owner: [],
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', () => {
    const payload = {
      title: 'Lorem ipsum dolor sit amet',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
      owner: 'user-123',
    };

    const addedThread = new AddThread(payload);

    expect(addedThread).toBeInstanceOf(AddThread);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.body).toEqual(payload.body);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
