class DetailCommentUseCase {
  constructor({ commentRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const { commentId } = useCasePayload;
    const comment = await this._commentRepository.getCommentById(commentId);
    const user = await this._userRepository.getUserById(comment.owner);
    return new DetailComment({ ...comment, username: user.username });
  }
}

module.exports = DetailCommentUseCase;
