const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils/errors");

class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    async destroy(id) {
        const response = await this.model.destroy({
            where: {
                id: id,
            },
        });
        if(!response) {
            throw new AppError("id not found", StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async get(data) {
        const response = await this.model.findByPk(data);
        if(!response) {
            throw new AppError("id not found", StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async getAll() {
        const response = await this.model.findAll();
        return response;
    }

    async update(id, data) { 
        const response = await this.model.update(data, {
            where:{
                id: id,
            }
        });
        if(!response[0]) {
            throw new AppError("id not found", StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

module.exports = CrudRepository;