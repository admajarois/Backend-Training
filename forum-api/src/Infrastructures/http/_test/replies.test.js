const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/replies endpoint', () => {

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {

    it('should response 201 and persisted reply', async () => {
    // Arrange
    const requestPayload = {
      content: 'This is a reply',
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

    const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;

    const commentPayload = {
      content: 'This is a comment',
    };
    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: commentPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const commentId = JSON.parse(commentResponse.payload).data.addedComment.id;

    // Action
    const replyResponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assert
    const replyJson = JSON.parse(replyResponse.payload);
    expect(replyResponse.statusCode).toEqual(201);
    expect(replyJson.status).toEqual('success');
      expect(replyJson.data.addedReply).toBeDefined();
    });
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
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
  
      const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;
  
      const commentPayload = {    
        content: 'This is a comment',
      };  
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const commentId = JSON.parse(commentResponse.payload).data.addedComment.id;
  
      // Action
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const replyJson = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(400);
      expect(replyJson.status).toEqual('fail');
      expect(replyJson.message).toEqual('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada');
    });
  
    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
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
      const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;
  
      const commentPayload = {
        content: 'This is a comment',
      };
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const commentId = JSON.parse(commentResponse.payload).data.addedComment.id; 
  
      // Action
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const replyJson = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(400);
      expect(replyJson.status).toEqual('fail');
      expect(replyJson.message).toEqual('tidak dapat membuat reply baru karena tipe data tidak sesuai');
    });
  
    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'This is a reply',
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
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/123/comments/123/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const replyJson = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(404);
      expect(replyJson.status).toEqual('fail');
      expect(replyJson.message).toEqual('Thread tidak ditemukan');
    });
  
    it('should response 404 when comment not found', async () => {
      // Arrange
        const requestPayload = {
          content: 'This is a reply',
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
      const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;
  
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/123/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const replyJson = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(404);
      expect(replyJson.status).toEqual('fail');
      expect(replyJson.message).toEqual('Comment tidak ditemukan');
    });
  
    it('should response 403 when not authenticated', async () => {
      // Arrange
      const requestPayload = {
        content: 'This is a reply',
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
      const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;
  
      const commentPayload = {
        content: 'This is a comment',
      };
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); 
      const commentId = JSON.parse(commentResponse.payload).data.addedComment.id;
  
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
      }); 
  
      const replyJson = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(401);
      expect(replyJson.error).toEqual('Unauthorized');
      expect(replyJson.message).toEqual('Missing authentication');
    });   
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and deleted reply', async () => {
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
      const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;  
      const commentPayload = {
        content: 'This is a comment',
      };
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const commentId = JSON.parse(commentResponse.payload).data.addedComment.id;

      const replyPayload = {
        content: 'This is a reply',
      };
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const replyId = JSON.parse(replyResponse.payload).data.addedReply.id;

      // Action
      const deleteReplyResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });   

      // Assert
      const replyJson = JSON.parse(deleteReplyResponse.payload);
      expect(deleteReplyResponse.statusCode).toEqual(200);
      expect(replyJson.status).toEqual('success');
      expect(replyJson.message).toEqual('Balasan berhasil dihapus');
    });
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

    const replyResponse = await server.inject({
      method: 'DELETE',
      url: `/threads/123/comments/123/replies/123`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const replyJson = JSON.parse(replyResponse.payload);
    expect(replyResponse.statusCode).toEqual(404);
    expect(replyJson.status).toEqual('fail');
    expect(replyJson.message).toEqual('Thread tidak ditemukan');  
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
    const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;

    const replyResponse = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/123/replies/123`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); 
    const replyJson = JSON.parse(replyResponse.payload);
    expect(replyResponse.statusCode).toEqual(404);
    expect(replyJson.status).toEqual('fail');
    expect(replyJson.message).toEqual('Comment tidak ditemukan');
  });

  it('should response 404 when reply not found', async () => {
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
    const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;

    const commentPayload = {
      content: 'This is a comment',
    };  
    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: commentPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const commentId = JSON.parse(commentResponse.payload).data.addedComment.id;

    const replyResponse = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}/replies/123`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); 
    const replyJson = JSON.parse(replyResponse.payload);
    expect(replyResponse.statusCode).toEqual(404);
    expect(replyJson.status).toEqual('fail');
    expect(replyJson.message).toEqual('Balasan tidak ditemukan');
  });

  it('should response 403 when user not authorized', async () => {
    // Arrange
    const server = await createServer(container);

    const threadUserPayload = {
      username: 'jacktheripper',
      password: 'secret',
      fullname: 'Jack the Ripper',
    };

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: threadUserPayload,
    });

    const loginResponse1 = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'jacktheripper',
        password: 'secret',
      },
    });
    const { accessToken: accessToken1 } = JSON.parse(loginResponse1.payload).data;

    const threadPayload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };
    const threadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: threadPayload,
      headers: {
        Authorization: `Bearer ${accessToken1}`,
      },
    });
    const threadId = JSON.parse(threadResponse.payload).data.addedThread.id;

    const commentUserPayload = {
      username: 'johndoe',
      password: 'secret',
      fullname: 'John Doe',
    };

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: commentUserPayload,
    });
    const loginResponse2 = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'johndoe',
        password: 'secret',
      },
    });
    const { accessToken: accessToken2 } = JSON.parse(loginResponse2.payload).data;

    const commentPayload = {
      content: 'This is a comment',
    };

    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: commentPayload,
      headers: {
        Authorization: `Bearer ${accessToken2}`,
      },
    });
    const commentId = JSON.parse(commentResponse.payload).data.addedComment.id;

    const replyPayload = {
      content: 'This is a reply',
    };
    const replyResponse = await server.inject({ 
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: replyPayload,
      headers: {
        Authorization: `Bearer ${accessToken1}`,
      },
    });
    const replyId = JSON.parse(replyResponse.payload).data.addedReply.id;


    const deleteReplyResponse = await server.inject({ 
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      headers: {
        Authorization: `Bearer ${accessToken2}`,
      },
    });
    const replyJson = JSON.parse(deleteReplyResponse.payload);
    expect(deleteReplyResponse.statusCode).toEqual(403);
    expect(replyJson.status).toEqual('fail');
    expect(replyJson.message).toEqual('Gagal mengakses resource');
  });
});
