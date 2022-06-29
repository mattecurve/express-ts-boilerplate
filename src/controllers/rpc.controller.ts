import { Request, Response } from 'express';
import { IRPCClient } from 'remote-procedure-call-rabbitmq/lib/types';
import { IRpcController } from './controller.interface';
import { RpcFunctionNames } from '../rpc';

interface IRpcControllerParams {
    asyncRpcClient: IRPCClient;
    syncRpcClient: IRPCClient;
}

export class RpcController implements IRpcController {
    _: IRpcControllerParams;

    constructor(params: IRpcControllerParams) {
        this._ = params;
    }

    async asyncTest(req: Request, res: Response): Promise<Response> {
        const response = await this._.asyncRpcClient.call(RpcFunctionNames.Test, {
            d: new Date().getTime(),
            id: req.query.id,
        });
        return res.json(response);
    }

    async syncTest(req: Request, res: Response): Promise<Response> {
        const response = await this._.syncRpcClient.call(RpcFunctionNames.Test, {
            id: req.query.id,
        });
        return res.json(response);
    }
}
