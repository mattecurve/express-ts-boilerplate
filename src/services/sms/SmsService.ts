import { ITextLocalService } from './ITextLocalService';
import { ISendBulkMessagesParams, ISendMessageParams, ISmsServiceParams } from './types';

export class SmsService {
    textLocalService: ITextLocalService;
    sender: string;

    constructor(params: ISmsServiceParams) {
        this.textLocalService = params.textLocalService;
        this.sender = params.sender;
    }

    async sendMessage(params: ISendMessageParams): Promise<any> {
        const sendMessageResponse = await this.textLocalService.sendMessage({
            sender: this.sender,
            ...params,
        });
        if (sendMessageResponse.status !== 'success') {
            throw new Error('Not able to send sms');
        }

        return {
            messages: sendMessageResponse.messages,
        };
    }

    async sendBulkMessages(params: ISendBulkMessagesParams): Promise<any> {
        const sendMessageResponse = await this.textLocalService.sendBulkMessages({
            sender: this.sender,
            ...params,
        });
        if (sendMessageResponse.status !== 'success') {
            throw new Error('Not able to send sms');
        }

        return {
            messages: sendMessageResponse.messages,
        };
    }
}
