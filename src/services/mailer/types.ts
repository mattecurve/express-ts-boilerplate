import * as NodeMailer from 'nodemailer';

export interface SendEmailParams extends NodeMailer.SendMailOptions {
}

export interface SendMessageInfo extends NodeMailer.SentMessageInfo {}

export interface IEmailService {
    sendEmail(params: SendEmailParams): Promise<SendMessageInfo>;
}