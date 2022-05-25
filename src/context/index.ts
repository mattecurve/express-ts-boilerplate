import path from 'path';
import config, { IConfig } from 'config';
import winston from 'winston';
import { IAuthTokenService, IFileService, ITodoService } from '../services/service.interface';
import { IAdminLoginController, IAuthController, ITodoController } from '../controllers/controller.interface';
import { TodoController } from '../controllers/todo.controller';
import { DBConnection } from '../db';
import { AuthTokenService, FileService, TodoService } from '../services';
import { AdminLoginController, AuthController } from '../controllers';
import { ILogger } from '../interfaces';

export class Context {
    services: {
        todoService?: ITodoService;
        authTokenService?: IAuthTokenService;
        fileService?: IFileService;
    } = {};

    controllers: {
        todoController?: ITodoController;
        authController?: IAuthController;
        adminLoginController?: IAdminLoginController;
    } = {};

    db: DBConnection;

    config: IConfig;

    logger: ILogger;

    getConfig(key: string) {
        return config.get(key);
    }

    isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }
}

const ctx = new Context();

export async function initContext() {
    // step - load config
    ctx.config = config;

    // step - load uploadDir
    const basePath = path.join(__dirname, '../../');
    const logsDir = path.join(basePath, 'logs');

    // step - load logger
    ctx.logger = ctx.isProduction()
        ? winston.createLogger({
              level: 'error',
              format: winston.format.json(),
              transports: [
                  new winston.transports.File({ dirname: logsDir, filename: 'error.log', level: 'error' }),
                  new winston.transports.File({ dirname: logsDir, filename: 'combined.log' }),
              ],
          })
        : winston.createLogger({
              level: 'info',
              format: winston.format.json(),
              transports: [new winston.transports.File({ dirname: logsDir, filename: 'combined.log' }), new winston.transports.Console()],
          });

    // step - init db connection
    ctx.db = new DBConnection({
        uri: config.get('app.mongodb.uri'),
        options: {
            autoIndex: true,
            autoCreate: true,
            dbName: config.get('app.mongodb.db'),
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
    ctx.controllers.adminLoginController = new AdminLoginController({
        userRepository: ctx.db.repository.user,
        authTokenService: ctx.services.authTokenService,
        logger: ctx.logger,
    });
}

export function loadContext() {
    return ctx;
}
