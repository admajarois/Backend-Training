class DetailCommentUseCase {
  constructor({ commentRepository, userRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { commentId } = useCasePayload;
    const comment = await this._commentRepository.getCommentById(commentId);
    return new DetailComment({ ...comment });
  }
}

module.exports = DetailCommentUseCase;
