import { ILogger } from '../../interfaces';
import { ITextLocalService } from './ITextLocalService';
import { ITrustSignalService } from './ITrustSignal.service';

export interface ISmsServiceParams {
    textLocalService: ITextLocalService;
    trustSignalService: ITrustSignalService;
    sender: string;
    logger: ILogger;
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
