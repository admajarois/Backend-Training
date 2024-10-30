class DetailCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { commentId } = useCasePayload;
    return this._commentRepository.getCommentById(commentId);
  }
}

module.exports = DetailCommentUseCase;
