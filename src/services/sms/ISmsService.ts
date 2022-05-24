import { ISendMessageParams } from './types';

export interface ISmsService {
    sendMessage(params: ISendMessageParams): Promise<any>;
}
