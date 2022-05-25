import { ITodo } from '../db/interfaces';
import { ITodoService } from './service.interface';

const todoList: Partial<ITodo>[] = [];

export class TodoService implements ITodoService {
    getAllTodo(): Promise<ITodo[]> {
        return Promise.resolve(todoList as ITodo[]);
    }

    createTodo(createParams: { name: string }): Promise<void> {
        todoList.push({
            name: createParams.name,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return Promise.resolve();
    }
}
