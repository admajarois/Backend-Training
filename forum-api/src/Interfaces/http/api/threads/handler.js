const AddThreadUseCase = require('../../../../Applications/use_case/thread/AddThreadUseCase');
const UpdateThreadUseCase = require('../../../../Applications/use_case/thread/UpdateThreadUseCase');
const DeleteThreadUseCase = require('../../../../Applications/use_case/thread/DeleteThreadUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/thread/DetailThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;
        console.log("container", container);
        
        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
        this.putThreadByIdHandler = this.putThreadByIdHandler.bind(this);
        this.deleteThreadByIdHandler = this.deleteThreadByIdHandler.bind(this);
        this.getThreadsHandler = this.getThreadsHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute(request.payload);
        console.log("addedThread", addedThread);
        
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

    async putThreadByIdHandler(request, h) {
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
    
    async deleteThreadByIdHandler(request, h) {
        const deleteThreadUseCase = this._container.getInstance(DeleteThreadUseCase.name);
        await deleteThreadUseCase.execute(request.params.id);

        const response = h.response({
            status: 'success',
        });
        return response;
    }

    async getThreadsHandler(request, h) {
        const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
        const threads = await detailThreadUseCase.execute(request.query);
        console.log("threads", threads);
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
