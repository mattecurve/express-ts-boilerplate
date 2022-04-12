import { ITodo } from '../db/interfaces';
import { ITodoService } from './service.interface';

const todoList: ITodo[] = [];

export class TodoService implements ITodoService {
    getAllTodo(): Promise<ITodo[]> {
        return Promise.resolve(todoList);
    }

    createTodo(createParams: { name: string }): Promise<void> {
        todoList.push({ name: createParams.name });
        return Promise.resolve();
    }
}
