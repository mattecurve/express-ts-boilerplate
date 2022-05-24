import { ITextLocalService } from './ITextLocalService';

export interface ISmsServiceParams {
    textLocalService: ITextLocalService;
    sender: string;
}

export interface ISendMessageParams {
    sender?: string;
    message: string;
    numbers: number[];
}

export interface ISendBulkMessagesParams {
    sender?: string;
    messages: {
        number: number;
        text: string;
    }[];
}
