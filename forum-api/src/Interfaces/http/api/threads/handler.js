const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadByIdUseCase = require('../../../../Applications/use_case/GetThreadByIdUseCase');
const PutThreadByIdUseCase = require('../../../../Applications/use_case/PutThreadByIdUseCase');
const DeleteThreadByIdUseCase = require('../../../../Applications/use_case/DeleteThreadByIdUseCase');
const GetThreadsUseCase = require('../../../../Applications/use_case/GetThreadsUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute(request.payload);

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getThreadByIdHandler(request, h) {
        const getThreadByIdUseCase = this._container.getInstance(GetThreadByIdUseCase.name);
        const thread = await getThreadByIdUseCase.execute(request.params.id);

        const response = h.response({
            status: 'success',
            data: {
                thread,
            },
        });
        return response;
    }

    async putThreadByIdHandler(request, h) {
        const putThreadByIdUseCase = this._container.getInstance(PutThreadByIdUseCase.name);
        const thread = await putThreadByIdUseCase.execute(request.params.id, request.payload);

        const response = h.response({
            status: 'success',
            data: {
                thread,
            },
        });
        return response;
    }
    
    async deleteThreadByIdHandler(request, h) {
        const deleteThreadByIdUseCase = this._container.getInstance(DeleteThreadByIdUseCase.name);
        await deleteThreadByIdUseCase.execute(request.params.id);

        const response = h.response({
            status: 'success',
        });
        return response;
    }

    async getThreadsHandler(request, h) {
        const getThreadsUseCase = this._container.getInstance(GetThreadsUseCase.name);
        const threads = await getThreadsUseCase.execute(request.query);

        const response = h.response({
            status: 'success',
            data: {
                threads,
            },
        });
        return response;
    }
}

module.exports = ThreadsHandler;
