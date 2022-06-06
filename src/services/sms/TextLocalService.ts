import axios from 'axios';
import {
    ITextLocalBalanceResponse,
    ITextLocalBulkMessagesResponse,
    ITextLocalMessageResponse,
    ITextLocalSendBulkMessagesParams,
    ITextLocalSenderNamesResponse,
    ITextLocalSendMessageParams,
    ITextLocalTemplateResponse,
} from './ITextLocalService';

/**
 * @doc - https://api.textlocal.in/docs/sendsms
 */
export class TextLocalService {
    apiUrl: string = 'https://api.textlocal.in/send/';
    apiBulkUrl: string = 'https://api.textlocal.in/bulk_json/';
    apiBalanceUrl: string = 'https://api.textlocal.in/balance/';
    apiTemplateUrl: string = 'https://api.textlocal.in/get_templates/';
    apiSenderNamesUrl: string = 'https://api.textlocal.in/get_sender_names/';
    apiKey: string;
    senderId: string;

    constructor(params: { apiKey: string; senderId: string }) {
        this.apiKey = params.apiKey;
        this.senderId = params.senderId;
    }

    async sendMessage(params: ITextLocalSendMessageParams): Promise<ITextLocalMessageResponse> {
        const data = {
            apikey: encodeURIComponent(this.apiKey),
            numbers: params.numbers.join(','),
            sender: encodeURIComponent(this.senderId),
            message: encodeURIComponent(params.message),
        };
        const urlParams = new URLSearchParams();
        urlParams.append('apikey', data.apikey);
        urlParams.append('numbers', data.numbers);
        urlParams.append('message', data.message);
        urlParams.append('sender', data.sender);

        return axios.post(this.apiUrl, urlParams).then((response) => response.data);
    }

    async sendBulkMessages(params: ITextLocalSendBulkMessagesParams): Promise<ITextLocalBulkMessagesResponse> {
        const data = {
            apikey: encodeURIComponent(this.apiKey),
            data: JSON.stringify({
                sender: encodeURIComponent(this.senderId),
                messages: params.messages.map((v) => {
                    // eslint-disable-next-line no-param-reassign
                    v.text = encodeURIComponent(v.text);
                    return v;
                }),
            }),
        };
        const urlParams = new URLSearchParams();
        urlParams.append('apikey', data.apikey);
        urlParams.append('data', data.data);

        return axios.post(this.apiBulkUrl, urlParams).then((response) => {
            return response.data;
        });
    }

    async getBalance(): Promise<ITextLocalBalanceResponse> {
        const params = new URLSearchParams();
        params.append('apikey', encodeURIComponent(this.apiKey));

        return axios.post(this.apiBalanceUrl, params).then((response) => {
            return response.data;
        });
    }

    async getTemplates(): Promise<ITextLocalTemplateResponse> {
        const params = new URLSearchParams();
        params.append('apikey', encodeURIComponent(this.apiKey));

        return axios.post(this.apiTemplateUrl, params).then((response) => {
            return response.data;
        });
    }

    async getSenderNames(): Promise<ITextLocalSenderNamesResponse> {
        const params = new URLSearchParams();
        params.append('apikey', encodeURIComponent(this.apiKey));

        return axios.post(this.apiSenderNamesUrl, params).then((response) => {
            return response.data;
        });
    }
}
