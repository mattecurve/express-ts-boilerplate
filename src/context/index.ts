import config from 'config';
import { IAuthTokenService, ITodoService } from '../services/service.interface';
import { IAuthController, ITodoController } from '../controllers/controller.interface';
import { TodoController } from '../controllers/todo.controller';
import { DBConnection } from '../db';
import { AuthTokenService, TodoService } from '../services';
import { AuthController } from '../controllers';

export enum ServiceTypes {}

export class Context {
    services: {
        todoService?: ITodoService;
        authTokenService?: IAuthTokenService;
    } = {};

    controllers: {
        todoController?: ITodoController;
        authController?: IAuthController;
    } = {};

    db: DBConnection;

    getConfig(key: string) {
        return config.get(key);
    }

    isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }
}

const ctx = new Context();

export async function initContext() {
    // step - init db connection
    ctx.db = new DBConnection({
        uri: config.get('app.mongodb.uri'),
        options: {
            autoIndex: true,
            autoCreate: true,
        },
    });
    await ctx.db.connect(config.get('app.mongodb.debug'));
    await ctx.db.registerCollections();

    // services
    ctx.services.todoService = new TodoService() as ITodoService;
    ctx.services.authTokenService = new AuthTokenService({
        secretKey: config.get('app.auth.secretKey'),
        expiration: config.get('app.auth.expiration'),
    });

    // controllers
    ctx.controllers.todoController = new TodoController({
        todoRepository: ctx.db.repository.todo,
        todoService: ctx.services.todoService,
    }) as ITodoController;
    ctx.controllers.authController = new AuthController(ctx.services.authTokenService);
}

export function loadContext() {
    return ctx;
}
