const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/replies/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({ ...request.payload, threadId, commentId, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

    await deleteReplyUseCase.execute({ threadId, commentId, replyId, owner });

    return {
      status: 'success',
      message: 'balasan berhasil dihapus',
    };
  }
}

module.exports = RepliesHandler;
