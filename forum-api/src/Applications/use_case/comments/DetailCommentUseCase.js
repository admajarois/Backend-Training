const DetailComment = require('../../../Domains/comments/entities/DetailComment');

class DetailCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { commentId } = useCasePayload;
    const comment = await this._commentRepository.getCommentById(commentId);
    return new DetailComment({ ...comment });
  }
}

module.exports = DetailCommentUseCase;
