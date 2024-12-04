const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');
const UpdateCommentUseCase = require('../../../../Applications/use_case/comments/UpdateCommentUseCase');
const DetailCommentUseCase = require('../../../../Applications/use_case/comments/DetailCommentUseCase');


class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.putCommentHandler = this.putCommentHandler.bind(this);
    this.getCommentHandler = this.getCommentHandler.bind(this);
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
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({ threadId, commentId, owner });

    return {
      status: 'success',
      message: 'Komentar berhasil dihapus',
    };
  }

  async putCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const updateCommentUseCase = this._container.getInstance(UpdateCommentUseCase.name);
    const updatedComment = await updateCommentUseCase.execute({ threadId, commentId, owner, ...request.payload });

    return {
      status: 'success',
      data: {
        updatedComment,
      },
    };
  }

  async getCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const detailCommentUseCase = this._container.getInstance(DetailCommentUseCase.name);
    console.log("threadId", threadId);
    console.log("commentId", commentId);
    const comment = await detailCommentUseCase.execute({ threadId, commentId });
    console.log(comment);
    return {
      status: 'success',
      data: {
        comment,
      },
    };
  }
}

module.exports = CommentsHandler;
