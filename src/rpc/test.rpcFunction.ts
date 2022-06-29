import { IContext } from '../context/types';

export function testServiceFunction(ctx: IContext) {
    return function serviceFn(data: any): Promise<any> {
        ctx.logger.info('serviceFn called', data);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 2000);
        });
    };
}
