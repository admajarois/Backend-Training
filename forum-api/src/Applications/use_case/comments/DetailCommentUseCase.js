class DetailCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { commentId } = useCasePayload;
    await this._threadRepository.verifyThreadAvailability(useCasePayload.threadId);
    const comment = await this._commentRepository.getCommentById(commentId);
    return comment;
  }
}

module.exports = DetailCommentUseCase;
