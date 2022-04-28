import { Response } from 'express';
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

export interface IFileService extends IService {
    uploadFile(fileName: string, buffer: Buffer): Promise<{ id: string; url: string | null }>;
    loadFile(id: string, res: Response): Promise<boolean>;
    removeFile(id: string): Promise<undefined>;
}
