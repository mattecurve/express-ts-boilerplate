/* eslint-disable max-classes-per-file */
import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import config from 'config';
import winston from 'winston';
import expressWinston from 'express-winston';
import _ from 'lodash';

import loadRouter from '../routes';
import { initContext, loadContext } from '../context';
import { errorHandler } from '../middlewares';
import { IApp } from './types';

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                role: string;
            } | null;
        }
    }
}

export class ApiApp implements IApp {
    app: Express;
    port: number;
    protected isRpcApp: boolean = false;
    protected initRpcServer: boolean = true;
    protected initRpcClient: boolean = true;

    constructor(params: { initRpcServer: boolean; initRpcClient: boolean }) {
        this.app = express();
        this.initRpcServer = params.initRpcServer;
        this.initRpcClient = params.initRpcClient;
    }

    async bootstrap(): Promise<void> {
        await initContext({
            initRpcClient: this.initRpcClient,
            initRpcServer: this.initRpcServer,
        });
        const ctx = loadContext();
        this.port = this.isRpcApp ? Number(`300${_.random(1, 9)}`) : config.get('app.port');
        this.app.disable('x-powered-by');
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(compression());
        // @todo - enable this for production only when you can hide secure fields from request
        if (!ctx.isProduction()) {
            this.app.use(
                expressWinston.logger({
                    transports: [new winston.transports.Console()],
                    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint()),
                    meta: true,
                }),
            );
        }

        this.app.use(config.get('app.apiPrefix') ? `/${config.get('app.apiPrefix')}/` : '/', loadRouter(ctx, this.isRpcApp));

        // log errors
        this.app.use(
            expressWinston.errorLogger({
                transports: [new winston.transports.Console()],
                format: winston.format.combine(winston.format.colorize(), winston.format.json(), winston.format.prettyPrint()),
            }),
        );
        this.app.use(errorHandler);
    }

    async serve(): Promise<void> {
        const server = this.app.listen(this.port, () => {
            // eslint-disable-next-line no-console
            console.log(`⚡️[server]: Server is running at http://localhost:${this.port}`);
        });

        // Handle SIGINT event
        process.on('SIGINT', async () => {
            // eslint-disable-next-line no-console
            console.log('graceful shutdown the server');
            server.close();
            await this.down();
            process.exit(0);
        });
    }

    async down(): Promise<void> {
        return loadContext().down();
    }
}

export class RpcApp extends ApiApp {
    constructor() {
        super({
            initRpcClient: false,
            initRpcServer: true,
        });
        this.isRpcApp = true;
    }
}
