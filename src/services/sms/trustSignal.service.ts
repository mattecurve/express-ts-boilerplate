import axios from 'axios';
import { ITrustSignalMessageResponse, ITrustSignalSendMessageParams, ITrustSignalService } from './ITrustSignal.service';

export class TrustSignalService implements ITrustSignalService {
    apiUrl: string;
    apiKey: string;
    senderId: string;
    otpTemplateId: string;
    private otpRoute: string = 'otp';
    private transactionalRoute: string = 'transactional';
    // private promotionalRoute: string = 'promotional';
    private smsEndPoint: string = '/sms';
    // private accountCreditsEndPoint: string = '/accounts/credits';

    constructor(params: { apiUrl: string; apiKey: string; senderId: string; otpTemplateId: string }) {
        this.apiUrl = params.apiUrl;
        this.apiKey = params.apiKey;
        this.senderId = params.senderId;
        this.otpTemplateId = params.otpTemplateId;
    }

    async sendMessage(params: ITrustSignalSendMessageParams): Promise<ITrustSignalMessageResponse> {
        const inputs = {
            to: params.numbers,
            message: params.message,
            route: params.isOtp ? this.otpRoute : this.transactionalRoute,
            sender_id: this.senderId,
            template_id: params.isOtp ? this.otpTemplateId : '',
        };
        return this.sendSms<ITrustSignalMessageResponse>(inputs);
    }

    private sendSms<T>(params: any): Promise<T> {
        const url = `${this.apiUrl}${this.smsEndPoint}?api_key=${this.apiKey}`;
        return axios.post(url, params).then((response) => response.data);
    }
}
