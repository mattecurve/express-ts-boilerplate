import _ from 'lodash';
import { ILogger } from '../../interfaces';
import { ITextLocalService } from './ITextLocalService';
import { ITrustSignalService } from './ITrustSignal.service';
import { ISendBulkMessagesParams, ISendMessageParams, ISmsServiceParams } from './types';

export class SmsService {
    textLocalService: ITextLocalService;
    trustSignalService: ITrustSignalService;
    logger: ILogger;

    constructor(params: ISmsServiceParams) {
        this.textLocalService = params.textLocalService;
        this.trustSignalService = params.trustSignalService;
    }

    async sendMessage(params: ISendMessageParams): Promise<any> {
        try {
            return this.sendMessageThroughTextLocal(params);
        } catch (error) {
            return this.sendMessageThroughTrustSignal(params);
        }
    }

    async sendBulkMessages(params: ISendBulkMessagesParams): Promise<any> {
        try {
            return this.sendBulkMessageThroughTextLocal(params);
        } catch (error) {
            return this.sendBulkMessageThroughTrustSignal(params);
        }
    }

    private async sendBulkMessageThroughTextLocal(params: ISendBulkMessagesParams) {
        const sendMessageResponse = await this.textLocalService.sendBulkMessages({
            ...params,
        });
        if (sendMessageResponse.status !== 'success') {
            this.logger.error(sendMessageResponse);
            throw new Error('Not able to send sms');
        }

        return {
            messages: sendMessageResponse.messages,
        };
    }

    private async sendMessageThroughTextLocal(params: ISendMessageParams) {
        const sendMessageResponse = await this.textLocalService.sendMessage({
            ...params,
        });
        if (sendMessageResponse.status !== 'success') {
            this.logger.error(sendMessageResponse);
            throw new Error('Not able to send sms');
        }

        return {
            messages: sendMessageResponse.messages,
        };
    }

    private async sendMessageThroughTrustSignal(params: ISendMessageParams) {
        const sendMessageResponse = await this.trustSignalService.sendMessage({
            ...params,
            isOtp: true,
        });
        if (!sendMessageResponse.success) {
            this.logger.error(sendMessageResponse);
            throw new Error('Not able to send sms');
        }

        return {
            messages: [sendMessageResponse.message],
        };
    }

    private async sendBulkMessageThroughTrustSignal(params: ISendBulkMessagesParams) {
        const { trustSignalService } = this;
        const responses: any = [];
        await Promise.all(
            _.map(params.messages, async (message) => {
                try {
                    const sendMessageResponse = await trustSignalService.sendMessage({
                        numbers: [message.number],
                        message: message.text,
                        isOtp: true,
                    });

                    if (!sendMessageResponse.success) {
                        this.logger.error(sendMessageResponse);
                        responses.push(sendMessageResponse);
                    } else {
                        responses.push(...sendMessageResponse.results);
                    }
                } catch (e) {
                    // do nothing
                }
            }),
        );

        return {
            messages: responses,
        };
    }
}
