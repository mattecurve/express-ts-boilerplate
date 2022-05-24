import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import config from 'config';
import winston from 'winston';
import expressWinston from 'express-winston';

import loadRouter from '../routes';
import { initContext, loadContext } from '../context';
import { errorHandler } from '../middlewares';

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

interface IApp {
    bootstrap(): Promise<void>;

    serve(): Promise<void>;
}

export class ApiApp implements IApp {
    app: Express;
    port: number;

    constructor() {
        this.app = express();
    }

    async bootstrap(): Promise<void> {
        await initContext();
        const ctx = loadContext();
        this.port = config.get('app.port');
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
        this.app.use(config.get('app.apiPrefix') ? `/${config.get('app.apiPrefix')}/` : '/', loadRouter(ctx));
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
        this.app.listen(this.port, () => {
            // eslint-disable-next-line no-console
            console.log(`⚡️[server]: Server is running at http://localhost:${this.port}`);
        });
    }
}
