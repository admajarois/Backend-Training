const AddComment = require('../../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    console.log('masuk sini add comment use case', useCasePayload);
    
    await this._threadRepository.getThreadById(useCasePayload.thread);
    console.log('masuk sini add comment use case 2');
    const addComment = new AddComment(useCasePayload);
    console.log('masuk sini add comment use case 3');
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
