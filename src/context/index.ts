import path from 'path';
import config, { IConfig } from 'config';
import winston from 'winston';
import * as amqp from 'amqplib';
import { RPCServer, RPCClient } from 'remote-procedure-call-rabbitmq';
import { IRPCClient, IRPCServer } from 'remote-procedure-call-rabbitmq/lib/types';
import _ from 'lodash';
import { testServiceFunction, RpcFunctionNames } from '../rpc';
import { IAuthTokenService, IFileService, ITodoService } from '../services/service.interface';
import { IAdminLoginController, IAuthController, ITodoController, IRpcController } from '../controllers/controller.interface';
import { TodoController } from '../controllers/todo.controller';
import { DBConnection } from '../db';
import { AuthTokenService, FileService, TodoService } from '../services';
import { AdminLoginController, AuthController, RpcController } from '../controllers';
import { ILogger } from '../interfaces';
import { IContext } from './types';

export class Context implements IContext {
    services: {
        todoService?: ITodoService;
        authTokenService?: IAuthTokenService;
        fileService?: IFileService;
    } = {};

    controllers: {
        todoController?: ITodoController;
        authController?: IAuthController;
        adminLoginController?: IAdminLoginController;
        rpcController?: IRpcController;
    } = {};

    db: DBConnection;

    rpcServers: IRPCServer[] = [];

    asyncRpcClient: IRPCClient;

    syncRpcClient: IRPCClient;

    config: IConfig;

    logger: ILogger;

    getConfig(key: string) {
        return config.get(key);
    }

    isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }

    async down(): Promise<void> {
        // stop all rpc connections
        await Promise.all(
            _.map(this.rpcServers, (rpcServer) => {
                return rpcServer.stop();
            }),
        );

        try {
            await this.db.disconnect();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
    }
}

const ctx = new Context();

export async function initContext(initRpcServer: boolean = true) {
    const isDebugMode = !ctx.isProduction();

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

    if (initRpcServer) {
        const rpcServerDefinitions = [
            {
                queue: 'sync_rpc_queue',
                synchronous: true,
                providers: [
                    {
                        name: RpcFunctionNames.Test,
                        fun: testServiceFunction(ctx),
                    },
                ],
            },
            {
                queue: 'async_rpc_queue',
                synchronous: false,
                providers: [
                    {
                        name: RpcFunctionNames.Test,
                        fun: testServiceFunction(ctx),
                    },
                ],
            },
        ];

        await Promise.all(
            _.map(rpcServerDefinitions, async (rpcServerDefinition) => {
                // rpc connection
                const rpcServer = new RPCServer(amqp, config.get('app.rpc.server'), rpcServerDefinition.queue);
                rpcServer.setDebug(isDebugMode);
                if (rpcServerDefinition.synchronous) {
                    rpcServer.setChannelPrefetchCount(1);
                }
                await rpcServer.start();
                rpcServerDefinition.providers.forEach((provider) => {
                    rpcServer.provide(provider.name, provider.fun);
                });
                ctx.rpcServers.push(rpcServer);
            }),
        );
    }

    ctx.syncRpcClient = new RPCClient(amqp, config.get('app.rpc.client'), 'sync_rpc_queue');
    ctx.syncRpcClient.setDebug(isDebugMode);
    await ctx.syncRpcClient.start();

    ctx.asyncRpcClient = new RPCClient(amqp, config.get('app.rpc.client'), 'async_rpc_queue');
    ctx.asyncRpcClient.setDebug(isDebugMode);
    await ctx.asyncRpcClient.start();

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
    ctx.controllers.rpcController = new RpcController({
        asyncRpcClient: ctx.asyncRpcClient,
        syncRpcClient: ctx.syncRpcClient,
    });
}

export function loadContext() {
    return ctx;
}
