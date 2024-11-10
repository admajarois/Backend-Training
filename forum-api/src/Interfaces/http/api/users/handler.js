const AddUserUseCase = require('../../../../Applications/use_case/user/AddUserUseCase');
const autoBind = require('auto-bind');

class UsersHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }

  async getUsersHandler(request, h) {
    const getUsersUseCase = this._container.getInstance(GetUsersUseCase.name);
    const users = await getUsersUseCase.execute(request.query);
  }
}

module.exports = UsersHandler;
