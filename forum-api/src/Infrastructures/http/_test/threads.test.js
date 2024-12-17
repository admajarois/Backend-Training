const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
      const server = await createServer(container);
      const userPayload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'johndoe',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        body: 'Thread Body',
      };
      const server = await createServer(container);
      const userPayload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'johndoe',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: ['Thread Body'],
      };
      const server = await createServer(container);
      const userPayload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'johndoe',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });
  describe('when GET /threads/:threadId', () => {
    it('should response 200 and return thread detail', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
      const loginPayload = {
        username: 'johndoe',
        password: 'secret',
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;

      const threadPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { addedThread } = JSON.parse(threadResponse.payload).data;
      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(addedThread.id);
      expect(responseJson.data.thread.title).toEqual(threadPayload.title);
      expect(responseJson.data.thread.body).toEqual(threadPayload.body);
    });
    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
  });
  describe('when PUT /threads/:threadId', () => {
    it('should response 200 and return thread detail', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
      const loginPayload = {
        username: 'johndoe',
        password: 'secret',
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;

      const threadPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { addedThread } = JSON.parse(threadResponse.payload).data;
      const threadPayloadUpdate = {
        title: 'Thread Title Update',
        body: 'Thread Body Update',
      };
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}`,
        payload: threadPayloadUpdate,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(addedThread.id);
      expect(responseJson.data.thread.title).toEqual(threadPayloadUpdate.title);
      expect(responseJson.data.thread.body).toEqual(threadPayloadUpdate.body);  
    });
    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
      const loginPayload = {
        username: 'johndoe',
        password: 'secret',
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;

      const threadPayloadUpdate = {
        title: 'Thread Title Update',
        body: 'Thread Body Update',
      };
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/thread-123`,
        payload: threadPayloadUpdate,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    }); 
    it('should response 403 when user not authorized to update thread', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
      const loginPayload = {
        username: 'johndoe',
        password: 'secret',
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;

      const threadPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { addedThread } = JSON.parse(threadResponse.payload).data;

      const threadPayloadUpdate = {
        title: 'Thread Title Update',
        body: 'Thread Body Update',
      };

      const userPayload2 = {
        username: 'janedoe',
        password: 'secret2',
        fullname: 'Jane Doe',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload2,
      });

      const loginPayload2 = {
        username: 'janedoe',
        password: 'secret2',
      };

      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload2,
      });

      const { accessToken: accessToken2 } = JSON.parse(loginResponse2.payload).data;
      
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}`,
        payload: threadPayloadUpdate,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });


      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
    });

  });
  describe('when DELETE /threads/:threadId', () => {
    it('should response 200 and return thread detail', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
      const loginPayload = {
        username: 'johndoe',
        password: 'secret',
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;

      const threadPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { addedThread } = JSON.parse(threadResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      }); 
      const loginPayload = {
        username: 'johndoe',
        password: 'secret',
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
    it('should response 403 when user not authorized to delete thread', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
      const loginPayload = {
        username: 'johndoe',
        password: 'secret',
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;

      const threadPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { addedThread } = JSON.parse(threadResponse.payload).data;

      const userPayload2 = {
        username: 'janedoe',
        password: 'secret2',
        fullname: 'Jane Doe',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload2,
      }); 

      const loginPayload2 = {
        username: 'janedoe',
        password: 'secret2',
      };

      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload2,
      });
      const { accessToken: accessToken2 } = JSON.parse(loginResponse2.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
    });
  });
  describe('when GET /threads', () => {
    it('should response 200 and return thread detail', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
      const loginPayload = {
        username: 'johndoe',
        password: 'secret',
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;

      const threadPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { addedThread } = JSON.parse(threadResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.threads).toBeDefined();
      expect(responseJson.data.threads[0].id).toEqual(addedThread.id);
      expect(responseJson.data.threads[0].title).toEqual(threadPayload.title);
      expect(responseJson.data.threads[0].body).toEqual(threadPayload.body);
    });
    it('should response 200 and return 2 threads', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });
      const loginPayload = {
        username: 'johndoe',
        password: 'secret',
      };
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;

      const threadPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
      await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadPayload2 = {
        title: 'Thread Title 2',
        body: 'Thread Body 2',
      };
      await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload2,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.threads).toBeDefined();
      expect(responseJson.data.threads.length).toEqual(2);
    });
  });
});
