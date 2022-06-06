export interface ITextLocalSendMessageParams {
    sender?: string;
    message: string;
    numbers: number[];
}

export interface ITextLocalSendBulkMessagesParams {
    sender?: string;
    messages: {
        number: number;
        text: string;
    }[];
}

export enum ITextLocalMessageStatus {
    Success = 'success',
    Failure = 'failure',
}

export interface ITextLocalMessageResponse {
    balance: number;
    messages: {
        id: string;
        recipient: number;
    }[];
    errors: {
        code: number;
        message: string;
    }[];
    status: ITextLocalMessageStatus;
}

export interface ITextLocalBulkMessagesResponse {
    total_cost: number;
    balance_post_send: number;
    messages: {
        messages: {
            id: string;
            recipient: number;
        }[];
    }[];
    messages_not_sent: {
        unique_id: string;
        number: number;
        message: string;
        error: {
            code: number;
            message: string;
        };
    }[];
    status: ITextLocalMessageStatus;
}

export interface ITextLocalBalanceResponse {
    balance: { sms: number };
    status: ITextLocalMessageStatus;
}

export interface ITextLocalTemplateResponse {
    templates: {
        id: number;
        body: string;
        title: string;
        senderName: string;
        isMyDND: string;
    }[];
    status: ITextLocalMessageStatus;
}

export interface ITextLocalSenderNamesResponse {
    default_sender_name: string;
    sender_names: string[];
    status: ITextLocalMessageStatus;
}

export interface ITextLocalService {
    sendMessage(params: ITextLocalSendMessageParams): Promise<ITextLocalMessageResponse>;
    sendBulkMessages(params: ITextLocalSendBulkMessagesParams): Promise<ITextLocalBulkMessagesResponse>;
}
