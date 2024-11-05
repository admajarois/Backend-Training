const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.putCommentHandler = this.putCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({ ...request.payload, threadId, owner });

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
