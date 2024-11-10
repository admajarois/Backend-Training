const AddThreadUseCase = require('../../../../Applications/use_case/thread/AddThreadUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/thread/DetailThreadUseCase');
const UpdateThreadUseCase = require('../../../../Applications/use_case/thread/UpdateThreadUseCase');
const DeleteThreadUseCase = require('../../../../Applications/use_case/thread/DeleteThreadUseCase');
const autoBind = require('auto-bind');


class ThreadsHandler {
    constructor(container) {
        this._container = container;
        
        autoBind(this);
    }

    async postThreadHandler(request, h) {
        const owner = request.auth.credentials.id;
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute({ ...request.payload, owner });
        
        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async detailThreadHandler(request, h) {
        const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
        const thread = await detailThreadUseCase.execute(request.params.id);
        const response = h.response({
            status: 'success',
            data: {
                thread,
            },
        });
        return response;
    }

    async updateThreadHandler(request, h) {
        const updateThreadUseCase = this._container.getInstance(UpdateThreadUseCase.name);
        const thread = await updateThreadUseCase.execute(request.params.id, request.payload);

        const response = h.response({
            status: 'success',
            data: {
                thread,
            },
        });
        return response;
    }
    
    async deleteThreadHandler(request, h) {
        const deleteThreadUseCase = this._container.getInstance(DeleteThreadUseCase.name);
        await deleteThreadUseCase.execute(request.params.id);

        const response = h.response({
            status: 'success',
        });
        return response;
    }

    async getThreadsHandler(request, h) {
        const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
        const threads = await getThreadUseCase.execute();
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
