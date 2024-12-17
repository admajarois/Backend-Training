const AddThreadUseCase = require('../../../../Applications/use_case/thread/AddThreadUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/thread/DetailThreadUseCase');
const UpdateThreadUseCase = require('../../../../Applications/use_case/thread/UpdateThreadUseCase');
const DeleteThreadUseCase = require('../../../../Applications/use_case/thread/DeleteThreadUseCase');


class ThreadsHandler {
    constructor(container) {
        this._container = container;
        
        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.detailThreadHandler = this.detailThreadHandler.bind(this);
        this.updateThreadHandler = this.updateThreadHandler.bind(this);
        this.deleteThreadHandler = this.deleteThreadHandler.bind(this);
        this.getThreadsHandler = this.getThreadsHandler.bind(this);
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
        const { id: threadId } = request.params;
        const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
        const thread = await detailThreadUseCase.execute(threadId);
        const response = h.response({
            status: 'success',
            data: {
                thread,
            },
        });
        return response;
    }

    async updateThreadHandler(request, h) {
        const owner = request.auth.credentials.id;
        const { id: threadId } = request.params;
        const { title, body } = request.payload;
        const updateThreadUseCase = this._container.getInstance(UpdateThreadUseCase.name);
        const thread = await updateThreadUseCase.execute({ id: threadId, title, body, owner });

        const response = h.response({
            status: 'success',
            data: {
                thread,
            },
        });
        return response;
    }
    
    async deleteThreadHandler(request, h) {
        const owner = request.auth.credentials.id;
        const deleteThreadUseCase = this._container.getInstance(DeleteThreadUseCase.name);
        await deleteThreadUseCase.execute({ id: request.params.id, owner });

        const response = h.response({
            status: 'success',
            message: 'Thread berhasil dihapus',
        });
        return response;
    }

    async getThreadsHandler(request, h) {
        const getThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
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
