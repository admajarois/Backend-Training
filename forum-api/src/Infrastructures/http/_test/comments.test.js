const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'This is a comment',
      };
      const server = await createServer(container);
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
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
          username: 'dicoding',
          password: 'secret',
        },
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
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
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
          username: 'dicoding',
          password: 'secret',
        },
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
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };
      const server = await createServer(container);
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
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
          username: 'dicoding',
          password: 'secret',
        },
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
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });
    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'This is a comment',
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
        url: '/threads/123/comments',
        payload: requestPayload,
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
  });
  describe('when DELETE /comments', () => {
    it('should response 200 when successfully delete comment', async () => {
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
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'johndoe',
          password: 'secret',
        },
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
      const commentPayload = {
        content: 'This is a comment',
      };
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); 
      const { addedComment } = JSON.parse(commentResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); 
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success'); 
      expect(responseJson.message).toEqual('Komentar berhasil dihapus');
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
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'johndoe',
          password: 'secret',
        },
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

      const commentPayload = {
        content: 'This is a comment',
      };
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { addedComment } = JSON.parse(commentResponse.payload).data;

      // Action
      const response = await server.inject({  
        method: 'DELETE',
        url: `/threads/123/comments/${addedComment.id}`,
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
    it('should response 404 when comment not found', async () => {
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
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'johndoe',
          password: 'secret',
        },
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
        url: `/threads/${addedThread.id}/comments/123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan'); 
    });
    it('should response 403 when user not authorized', async () => {
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
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'johndoe',
          password: 'secret',
        },
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
      const commentPayload = {
        content: 'This is a comment',
      };
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { addedComment } = JSON.parse(commentResponse.payload).data;  
      const userPayload2 = {
        username: 'janedoe',
        password: 'secret',
        fullname: 'Jane Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload2,
      });
      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'janedoe',
          password: 'secret',
        },
      });
      const { accessToken: accessToken2 } = JSON.parse(loginResponse2.payload).data;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
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
  describe('when PUT /comments', () => {
    it('should response 200 when successfully update comment', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
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
          username: 'dicoding',
          password: 'secret',
        },
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
      const commentPayload = {
        content: 'This is a comment',
      };
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { addedComment } = JSON.parse(commentResponse.payload).data;

      const updatePayload = {
        content: 'This is an updated comment',
      };

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        payload: updatePayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.updatedComment.content).toEqual(updatePayload.content);
    });
    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
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
          username: 'dicoding',
          password: 'secret',
        },
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
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); 

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });
    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
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
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { accessToken } = JSON.parse(loginResponse.payload).data;
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/123/comments/123`,
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
    it('should response 403 when user not authorized', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
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
          username: 'dicoding',
          password: 'secret',
        },
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
      const commentPayload = {
        content: 'This is a comment',
      };
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { addedComment } = JSON.parse(commentResponse.payload).data;
      const userPayload2 = {
        username: 'janedoe',
        password: 'secret',
        fullname: 'Jane Doe',
      };
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload2,
      });
      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'janedoe',
          password: 'secret',
        },
      });
      const { accessToken: accessToken2 } = JSON.parse(loginResponse2.payload).data;
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
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
  describe('when GET /comments', () => {
    it('should response 200 when successfully get comment', async () => {
      // Arrange
      const server = await createServer(container);
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
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
          username: 'dicoding',
          password: 'secret',
        },
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
      const commentPayload = {
        content: 'This is a comment',
      };
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { addedComment } = JSON.parse(commentResponse.payload).data;

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.comment.id).toEqual(addedComment.id);
      expect(responseJson.data.comment.content).toEqual(addedComment.content);
    });
  });
});
