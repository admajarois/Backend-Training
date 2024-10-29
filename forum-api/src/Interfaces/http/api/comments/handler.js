class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.putCommentHandler = this.putCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    this._validator.validatePostCommentPayload(request.payload);
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addedComment = await this._container.addComment(threadId, owner, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._container.verifyCommentOwner(commentId, owner);
    await this._container.deleteComment(threadId, commentId);

    return {
      status: 'success',
    };
  }

  async putCommentHandler(request, h) {
    this._validator.validatePutCommentPayload(request.payload);
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._container.verifyCommentOwner(commentId, owner);
    const updatedComment = await this._container.updateComment(threadId, commentId, request.payload);

    return {
      status: 'success',
      data: {
        updatedComment,
      },
    };
  }
}

module.exports = CommentsHandler;
