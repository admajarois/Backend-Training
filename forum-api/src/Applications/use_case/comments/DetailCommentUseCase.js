class DetailCommentUseCase {
  constructor({ commentRepository, userRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { commentId } = useCasePayload;
    const comment = await this._commentRepository.getCommentById(commentId);
    const user = await this._userRepository.getUserById(comment.owner);
    const replies = await this._replyRepository.getRepliesByCommentId(commentId);
    return new DetailComment({ ...comment, username: user.username, replies });
  }
}

module.exports = DetailCommentUseCase;
