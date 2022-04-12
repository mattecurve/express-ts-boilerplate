import { Request, Response } from 'express';

export interface IController {}

export interface ITodoController extends IController {
    getAllTodo(req: Request, res: Response): Promise<Response>;
    getAllTodoByService(req: Request, res: Response): Promise<Response>;
    createTodo(req: Request, res: Response): Promise<Response>;
    notFoundError(req: Request, res: Response): Promise<Response>;
    internalServerError(req: Request, res: Response): Promise<Response>;
}

export interface IAuthController extends IController {
    createToken(req: Request, res: Response): Promise<Response>;
    validateToken(req: Request, res: Response): Promise<Response>;
}
