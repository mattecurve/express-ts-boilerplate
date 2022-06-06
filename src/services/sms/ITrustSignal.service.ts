export interface ITrustSignalSendMessageParams {
    sender?: string;
    message: string;
    numbers: number[];
    isOtp: boolean;
}

export interface ITrustSignalSendBulkMessagesParams {
    sender?: string;
    isOtp: boolean;
    messages: {
        number: number;
        text: string;
    }[];
}

export interface ITrustSignalMessageResponse {
    success: boolean;
    message: string;
    results: {
        phone: string;
        transaction_id: string;
        error?: string;
    }[];
    errors?: any[];
}

export interface ITrustSignalService {
    sendMessage(params: ITrustSignalSendMessageParams): Promise<ITrustSignalMessageResponse>;
}
