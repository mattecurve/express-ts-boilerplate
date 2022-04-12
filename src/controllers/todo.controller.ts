import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { HttpException } from '../error';
import { ITodoService } from '../services/service.interface';

import { ITodoController } from './controller.interface';

interface TodoControllerParams {
    todoRepository: Model<any, {}>;
    todoService: ITodoService;
}

export class TodoController implements ITodoController {
    todoRepository: Model<any, {}>;
    todoService: ITodoService;

    constructor(params: TodoControllerParams) {
        this.todoRepository = params.todoRepository;
        this.todoService = params.todoService;
    }

    async getAllTodo(req: Request, res: Response): Promise<Response> {
        const result = await this.todoRepository.find();
        return res.json({
            ok: true,
            result,
        });
    }

    async getAllTodoByService(req: Request, res: Response): Promise<Response> {
        const result = await this.todoService.getAllTodo();
        return res.json({
            ok: true,
            result,
        });
    }

    async createTodo(req: Request, res: Response): Promise<Response> {
        const { name } = req.body as { name: string };
        await this.todoService.createTodo({ name });
        return res.json({
            user: req.user,
            ok: true,
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async notFoundError(req: Request, res: Response): Promise<Response> {
        throw new HttpException(404, 'not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async internalServerError(req: Request, res: Response): Promise<Response> {
        throw new HttpException(500, 'Internal server error', 'error');
    }
}
