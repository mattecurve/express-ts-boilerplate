import { ITodo } from '../db/interfaces';
import { AuthToken, AuthTokenValidation } from '../interfaces';

export interface IService {}

export interface ITodoService extends IService {
    getAllTodo(): Promise<ITodo[]>;
    createTodo(createParams: { name: string }): Promise<void>;
}

export interface IAuthTokenService extends IService {
    createToken(id: string): Promise<AuthToken>;
    validateToken(token: string): Promise<AuthTokenValidation>;
}
