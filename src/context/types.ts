import { IConfig } from 'config';
import { IRPCClient, IRPCServer } from 'remote-procedure-call-rabbitmq/lib/types';
import { IAuthTokenService, IFileService, ITodoService } from '../services/service.interface';
import { IAdminLoginController, IAuthController, IRpcController, ITodoController } from '../controllers/controller.interface';
import { DBConnection } from '../db';
import { ILogger } from '../interfaces';

export interface IContext {
    services: {
        todoService?: ITodoService;
        authTokenService?: IAuthTokenService;
        fileService?: IFileService;
    };

    controllers: {
        todoController?: ITodoController;
        authController?: IAuthController;
        adminLoginController?: IAdminLoginController;
        rpcController?: IRpcController;
    };

    db: DBConnection;

    rpcServers: IRPCServer[];

    asyncRpcClient: IRPCClient;

    syncRpcClient: IRPCClient;

    config: IConfig;

    logger: ILogger;

    getConfig(key: string): unknown;

    isProduction(): boolean;

    down(): Promise<void>;
}
