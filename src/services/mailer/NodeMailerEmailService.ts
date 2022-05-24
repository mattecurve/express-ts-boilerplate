import * as NodeMailer from 'nodemailer';
import { IEmailService, SendEmailParams, SendMessageInfo } from './types';

export class NodeMailerEmailService implements IEmailService {
    transporter: any;

    constructor(transporter: NodeMailer.Transporter) {
        this.transporter = transporter;
    }

    sendEmail(params: SendEmailParams): Promise<SendMessageInfo> {
        return this.transporter.sendMail(params);
    }
}
