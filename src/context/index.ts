import config from 'config';
import { IAuthTokenService, IFileService, ITodoService } from '../services/service.interface';
import { IAuthController, ITodoController } from '../controllers/controller.interface';
import { TodoController } from '../controllers/todo.controller';
import { DBConnection } from '../db';
import { AuthTokenService, FileService, TodoService } from '../services';
import { AuthController } from '../controllers';

export enum ServiceTypes {}

export class Context {
    services: {
        todoService?: ITodoService;
        authTokenService?: IAuthTokenService;
        fileService?: IFileService;
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
    ctx.services.fileService = new FileService({
        gfs: ctx.db.gfs,
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
